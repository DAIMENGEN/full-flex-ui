import React, {useCallback, useMemo, useRef} from "react";
import {fs_class} from "../../../../constants";
import {ScheduleApi} from "../../../../models/schedule";
import {ResourceApi} from "../../../../models/resource";
import {ConditionalRenderer} from "../../../../../../common/components/conditional-renderer";
import {StyleUtil} from "../../../../../../common/utils/style-util";
import {message} from "antd";

export const FullScheduleTimelineLane: React.FC<{ scheduleApi: ScheduleApi, resourceApi: ResourceApi, timelineWidth: number }> = (props) => {
    const startXRef = useRef<number>(0);
    const startLeftRef = useRef<number>(0);
    const startRightRef = useRef<number>(0);
    const isMoveableRef = useRef(false);
    const [messageApi, contextHolder] = message.useMessage();
    const animationFrameRef = useRef<number | null>(null);
    const timelineLaneRef = useRef<HTMLDivElement | null>(null);
    const timelineLaneSelectedArea = useMemo(() => `${fs_class}-timeline-lane-selected-area`, []);
    const warning = useCallback(() => {
        messageApi.open({
            type: "warning",
            content: "Sorry, There are already existing an event.",
        }).then();
    }, [messageApi]);

    const callSelectAllow = useCallback((element: HTMLDivElement) => {
        const scheduleApi = props.scheduleApi;
        const scheduleView = scheduleApi.getScheduleView();
        const timelineView = scheduleView.getTimelineView();
        const slotWidth = timelineView.calculateSlotWidth(props.timelineWidth);
        const selectedArea = element.firstElementChild as HTMLDivElement;
        const left = StyleUtil.pixelsToNumber(selectedArea.style.left);
        const right = StyleUtil.pixelsToNumber(selectedArea.style.right);
        const startDate = timelineView.calculateDate(props.timelineWidth, left + slotWidth);
        const endDate = timelineView.calculateDate(props.timelineWidth, props.timelineWidth - right);
        scheduleApi.selectAllow({
            el: element,
            resourceApi: props.resourceApi,
            startDate: startDate,
            endDate: endDate,
        });
    }, [props]);

    const createSelectedArea = useCallback((element: HTMLDivElement, offsetX: number) => {
        const scheduleApi = props.scheduleApi;
        const scheduleView = scheduleApi.getScheduleView();
        const timelineView = scheduleView.getTimelineView();
        const laneHeight = timelineView.calculateLaneHeight(props.resourceApi);
        const slotWidth = timelineView.calculateSlotWidth(props.timelineWidth);
        const multiple = Math.floor(offsetX / slotWidth);
        const distance = multiple * slotWidth;
        const left = StyleUtil.numberToPixels(distance);
        const right = StyleUtil.numberToPixels(props.timelineWidth - distance - slotWidth);
        const height = StyleUtil.numberToPixels(laneHeight);
        const selectedArea = document.createElement("div");
        selectedArea.className = timelineLaneSelectedArea;
        Object.assign(selectedArea.style, {
            position: "absolute",
            left: left,
            right: right,
            height: height,
            backgroundColor: "rgb(188, 232, 241, 0.7)"
        });
        element.appendChild(selectedArea);
        startLeftRef.current = StyleUtil.pixelsToNumber(left);
        startRightRef.current = StyleUtil.pixelsToNumber(right);
    }, [props]);

    const removeSelectedArea = useCallback((element: HTMLDivElement) => {
        const selectedArea = element.querySelector(`.${timelineLaneSelectedArea}`);
        selectedArea && element.removeChild(selectedArea);
    }, []);

    const updateSelectedArea = useCallback((element: HTMLDivElement, clientX: number) => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
            const selectedArea = element.querySelector(`.${timelineLaneSelectedArea}`) as HTMLDivElement;
            if (selectedArea) {
                const scheduleApi = props.scheduleApi;
                const scheduleView = scheduleApi.getScheduleView();
                const timelineView = scheduleView.getTimelineView();
                const slotWidth = timelineView.calculateSlotWidth(props.timelineWidth);
                const rect = selectedArea.getBoundingClientRect();
                const deltaX = clientX - startXRef.current;
                if (Math.sign(deltaX) === 1) {
                    // update right.
                    const offsetRatio = (clientX - rect.left) / slotWidth;
                    const multiple = Math.floor(offsetRatio);
                    const distance = multiple * slotWidth;
                    const newRight = Math.max(startRightRef.current - distance, 0);
                    selectedArea.style.right = StyleUtil.numberToPixels(newRight);
                } else if (Math.sign(deltaX) === -1) {
                    // update left.
                    const offsetRatio = (clientX - rect.right) / slotWidth;
                    const multiple = Math.ceil(offsetRatio);
                    const distance = multiple * slotWidth;
                    const newLeft = Math.max(startLeftRef.current + distance, 0)
                    selectedArea.style.left = StyleUtil.numberToPixels(newLeft);
                }
            }
        });
    }, [props]);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const timelineLane = timelineLaneRef.current;
        if (timelineLane) {
            timelineLane.style.zIndex = "5";
            isMoveableRef.current = true;
            startXRef.current = event.clientX;
            createSelectedArea(timelineLane, event.nativeEvent.offsetX);
        }
    }, [createSelectedArea]);

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const isMoveable = isMoveableRef.current;
        const timelineLane = timelineLaneRef.current;
        isMoveable && timelineLane && updateSelectedArea(timelineLane, event.clientX);
    }, [updateSelectedArea]);

    const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const isMoveable = isMoveableRef.current;
        const timelineLane = timelineLaneRef.current;
        if (isMoveable && timelineLane) {
            timelineLane.style.zIndex = "1";
            isMoveableRef.current = false;
            const editable = props.scheduleApi.isEditable();
            if (editable) {
                const length = props.resourceApi.getEventApis().length;
                Math.sign(length) === 1 ? warning() : callSelectAllow(timelineLane);
            }
            removeSelectedArea(timelineLane);
        }
    }, [props, warning, callSelectAllow, removeSelectedArea]);

    const handleMouseOut: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const isMoveable = isMoveableRef.current;
        const target = event.relatedTarget as Node;
        const timelineLane = timelineLaneRef.current;
        if (isMoveable && timelineLane && !timelineLane.contains(target)) {
            timelineLane.style.zIndex = "1";
            isMoveableRef.current = false;
            const length = props.resourceApi.getEventApis().length;
            Math.sign(length) === 1 ? warning() : callSelectAllow(timelineLane);
            removeSelectedArea(timelineLane);
        }
    }, [props, warning, callSelectAllow, removeSelectedArea]);

    return (
        <ConditionalRenderer condition={props.scheduleApi.isSelectable()} fallback={<div className={`${fs_class}-timeline-lane`}/>}>
            <div className={`${fs_class}-timeline-lane`} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} ref={timelineLaneRef}>
                {contextHolder}
            </div>
        </ConditionalRenderer>
    )
}