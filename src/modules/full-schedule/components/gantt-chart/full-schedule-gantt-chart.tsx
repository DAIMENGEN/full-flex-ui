import React, {useCallback, useMemo, useRef} from "react";
import {fs_class, grid, presentation} from "../../constants";
import {useSyncScroll} from "../../hooks/useSyncScroll";
import {ScheduleProps} from "../../models/schedule";
import {FullScheduleDatagridHeader} from "./segments/datagrid-header/full-schedule-datagrid-header";
import {FullScheduleDatagridBody} from "./segments/datagrid-body/full-schedule-datagrid-body";
import {ScheduleView} from "../../models/schedule-view";
import {FullScheduleTimelineHeaderTable} from "./segments/timeline/full-schedule-timeline-header-table";
import {FullScheduleTimelineBodyTable} from "./segments/timeline/full-schedule-timeline-body-table";
import {FullScheduleTimelineDrawingBoardTable} from "./segments/timeline/full-schedule-timeline-drawing-board-table";
import {useScheduleHeight} from "../../hooks/useScheduleHeight";
import {StyleUtil} from "../../../../common/utils/style-util";
import {useFullScheduleDispatch, useFullScheduleSelector} from "../../features/full-schedule-hook";
import {changeResourceAreaWidth} from "../../features/resource/resource-slice";
import {useScheduleMount} from "../../hooks/mounts/useScheduleMount";
import {useResourceAreaWidth} from "../../hooks/useResourceAreaWidth";

export const FullScheduleGanttChart: React.FC<ScheduleProps> = (props) => {
    const fullScheduleDispatch = useFullScheduleDispatch();
    const scheduleElRef = useRef<HTMLDivElement | null>(null);
    const headerLeftScrollerRef = useRef<HTMLDivElement | null>(null);
    const headerRightScrollerRef = useRef<HTMLDivElement | null>(null);
    const bodyRightScrollerRef = useRef<HTMLDivElement | null>(null);
    const bodyLeftScrollerRef = useRef<HTMLDivElement | null>(null);
    const resourceAreaColRef = useRef<HTMLTableColElement | null>(null);
    const resourceAreaWidth = useFullScheduleSelector(state => state.resourceState.resourceAreaWidth);

    const scheduleView = useMemo(() => new ScheduleView(props, scheduleElRef), [props]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const resourceAreaCol = resourceAreaColRef.current;
        if (resourceAreaCol) {
            const offset = event.clientX - resourceAreaCol.offsetLeft;
            resourceAreaCol.style.width = StyleUtil.numberToPixels(offset);
            fullScheduleDispatch(changeResourceAreaWidth(resourceAreaCol.style.width));
        }
    }, []);

    const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const scheduleEl = scheduleElRef.current;
        if (scheduleEl) {
            scheduleEl.removeEventListener("mousemove", handleMouseMove);
        } else {
            console.error("scheduleEl", scheduleEl);
        }
    }, [handleMouseMove]);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const scheduleEl = scheduleElRef.current;
        if (scheduleEl) {
            scheduleEl.addEventListener("mousemove", handleMouseMove);
        } else {
            console.error("scheduleEl", scheduleEl);
        }
    }, [handleMouseMove]);

    useScheduleHeight(props.scheduleMaxHeight);
    useSyncScroll(bodyRightScrollerRef, Array.of(headerRightScrollerRef), "left");
    useSyncScroll(bodyRightScrollerRef, Array.of(bodyLeftScrollerRef), "top");
    useSyncScroll(bodyLeftScrollerRef, Array.of(bodyRightScrollerRef), "top");
    useSyncScroll(bodyLeftScrollerRef, Array.of(headerLeftScrollerRef), "left");
    useResourceAreaWidth(resourceAreaColRef, props.resourceAreaWidth);
    useScheduleMount(scheduleElRef, scheduleView);

    return (
        <div className={`${fs_class}`} ref={scheduleElRef} onMouseUp={handleMouseUp}>
            <div id={`${fs_class}-view-harness`} className={`${fs_class}-view-harness`}>
                <div className={`${fs_class}-view`}>
                    <table role={grid} className={`${fs_class}-scrollgrid`}>
                        <colgroup>
                            <col style={{width: resourceAreaWidth}} ref={resourceAreaColRef}/>
                            <col/>
                            <col/>
                        </colgroup>
                        <thead>
                            <tr role={presentation} className={`${fs_class}-scrollgrid-section ${fs_class}-scrollgrid-section-header`}>
                                <th role={presentation}>
                                    <div className={`${fs_class}-scroller-harness`}>
                                        <div className={`${fs_class}-scroller-header-left`} ref={headerLeftScrollerRef}>
                                            <FullScheduleDatagridHeader scheduleView={scheduleView}/>
                                        </div>
                                    </div>
                                </th>
                                <th role={presentation} className={`${fs_class}-resource-timeline-divider`} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}></th>
                                <th role={presentation}>
                                    <div className={`${fs_class}-scroller-harness`}>
                                        <div className={`${fs_class}-scroller-header-right`} ref={headerRightScrollerRef}>
                                            <div id={`${fs_class}-timeline-header`} className={`${fs_class}-timeline-header`}>
                                                <FullScheduleTimelineHeaderTable scheduleView={scheduleView}/>
                                            </div>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr role={presentation} className={`${fs_class}-scrollgrid-section ${fs_class}-scrollgrid-section-body`}>
                                <td role={presentation}>
                                    <div className={`${fs_class}-scroller-harness`}>
                                        <div className={`${fs_class}-scroller-body-left`} ref={bodyLeftScrollerRef}>
                                            <FullScheduleDatagridBody scheduleView={scheduleView}/>
                                        </div>
                                    </div>
                                </td>
                                <td role={presentation} className={`${fs_class}-resource-timeline-divider`}></td>
                                <td role={presentation}>
                                    <div className={`${fs_class}-scroller-harness`}>
                                        <div className={`${fs_class}-scroller-body-right`} ref={bodyRightScrollerRef}>
                                            <div className={`${fs_class}-timeline-body`}>
                                                <FullScheduleTimelineBodyTable scheduleView={scheduleView}/>
                                                <FullScheduleTimelineDrawingBoardTable scheduleView={scheduleView}/>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}