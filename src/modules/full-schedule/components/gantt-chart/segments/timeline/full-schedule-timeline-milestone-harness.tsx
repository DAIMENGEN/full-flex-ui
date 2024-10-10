import React, {useRef} from "react";
import {Dropdown} from "antd";
import {fs_class} from "../../../../constants";
import {MilestoneApi} from "../../../../models/milestone";
import {Position} from "../../../../../../common/models/common";
import {StyleUtil} from "../../../../../../common/utils/style-util";
import {FlagIcon01} from "../../../../../../common/svg-icons/flag-icon-01";
import {ScheduleApi} from "../../../../models/schedule";
import {useMoveTimelineMarker} from "../../../../hooks/useMoveTimelineMarker";
import {useMilestoneMount} from "../../../../hooks/mounts/useMilestoneMount";

export const FullScheduleTimelineMilestoneHarness: React.FC<{ scheduleApi: ScheduleApi, milestoneApi: MilestoneApi, timelineWidth: number, position: Position }> = (props) => {
    const timelineMilestoneRef = useRef<HTMLDivElement | null>(null);
    const timelineMilestoneHarnessRef = useRef<HTMLDivElement | null>(null);
    const isEditable = props.scheduleApi.isEditable();
    const status = props.milestoneApi.getStatus();
    const color = props.milestoneApi.getColor().getOrElse(status === "Success" ? "green" : (status === "Failure" ? "red" : "yellow"));
    const timelineView = props.scheduleApi.getScheduleView().getTimelineView();
    const laneHeight = timelineView.calculateLaneHeight(props.milestoneApi.getResourceApi());
    const top = laneHeight * 0.1 * -1;
    const {isPast, isFuture, isProcess} = useMilestoneMount(timelineMilestoneRef, props.scheduleApi, props.milestoneApi);
    const {handleMouseUp, handleMouseDown} = useMoveTimelineMarker({
        markerRef: timelineMilestoneHarnessRef,
        timelineWidth: props.timelineWidth,
        scheduleApi: props.scheduleApi,
        milestoneApi: props.milestoneApi
    });
    return (
        <div className={`${fs_class}-timeline-milestone-harness`} style={{
            top: StyleUtil.numberToPixels(top),
            height: StyleUtil.numberToPixels(laneHeight),
            lineHeight: StyleUtil.numberToPixels(laneHeight),
            left: StyleUtil.numberToPixels(props.position.left),
            right: StyleUtil.numberToPixels(props.position.right),
        }} onMouseUp={isEditable ? handleMouseUp : void 0} onMouseDown={isEditable ? handleMouseDown: void 0} ref={timelineMilestoneHarnessRef}>
            <Dropdown disabled={!props.scheduleApi.isEnableMilestoneContextMenu()}
                      destroyPopupOnHide={true}
                      trigger={["contextMenu"]}
                      menu={{
                          items: props.scheduleApi.getMilestoneContextMenuItems(),
                          onClick: (arg) => {
                              const {key, keyPath, domEvent} = arg;
                              props.scheduleApi.onMilestoneContextMenuClick({
                                  key: key,
                                  keyPath: keyPath,
                                  domEvent: domEvent,
                                  isPast: isPast,
                                  isFuture: isFuture,
                                  isProcess: isProcess,
                                  milestoneApi: props.milestoneApi,
                                  scheduleApi: props.scheduleApi,
                              })
                          }
                      }}>
                <div className={`${fs_class}-timeline-milestone`} ref={timelineMilestoneRef}>
                    <div className={`${fs_class}-milestone-main`}>
                        <FlagIcon01 width={laneHeight * 0.5} height={laneHeight * 0.5} color={color}/>
                    </div>
                </div>
            </Dropdown>
        </div>
    )
}