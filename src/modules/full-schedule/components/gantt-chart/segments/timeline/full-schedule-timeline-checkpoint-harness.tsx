import React, {useRef} from "react";
import {Dropdown} from "antd";
import {Position} from "../../../../../../common/models/common";
import {fs_class} from "../../../../constants";
import {StyleUtil} from "../../../../../../common/utils/style-util";
import {DropletIcon01} from "../../../../../../common/svg-icons/droplet-icon-01";
import {CheckpointApi} from "../../../../models/checkpoint";
import {ScheduleApi} from "../../../../models/schedule";
import {useMoveTimelineMarker} from "../../../../hooks/useMoveTimelineMarker";
import {useCheckpointMount} from "../../../../hooks/mounts/useCheckpointMount";

export const FullScheduleTimelineCheckpointHarness: React.FC<{scheduleApi: ScheduleApi, checkpointApi: CheckpointApi, timelineWidth: number, position: Position}> = (props) => {
    const timelineCheckpointRef = useRef<HTMLDivElement | null>(null);
    const timelineCheckpointHarnessRef = useRef<HTMLDivElement | null>(null);
    const isEditable = props.scheduleApi.isEditable();
    const color = props.checkpointApi.getColor().getOrElse("black");
    const timelineView = props.scheduleApi.getScheduleView().getTimelineView();
    const laneHeight = timelineView.calculateLaneHeight(props.checkpointApi.getResourceApi());
    const eventHeight = timelineView.calculateEventHeight();
    const top = (laneHeight - eventHeight) / 2 + 2;
    const {isPast, isFuture, isProcess} = useCheckpointMount(timelineCheckpointRef, props.scheduleApi, props.checkpointApi);
    const {handleMouseUp, handleMouseDown} = useMoveTimelineMarker({
        markerRef: timelineCheckpointHarnessRef,
        timelineWidth: props.timelineWidth,
        scheduleApi: props.scheduleApi,
        checkpointApi: props.checkpointApi
    });
    return (
        <div className={`${fs_class}-timeline-checkpoint-harness`} style={{
            top: StyleUtil.numberToPixels(top),
            height: StyleUtil.numberToPixels(eventHeight),
            lineHeight: StyleUtil.numberToPixels(eventHeight),
            left: StyleUtil.numberToPixels(props.position.left),
            right: StyleUtil.numberToPixels(props.position.right),
        }} onMouseUp={isEditable ? handleMouseUp : void 0} onMouseDown={isEditable ? handleMouseDown : void 0} ref={timelineCheckpointHarnessRef}>
            <Dropdown disabled={!props.scheduleApi.isEnableCheckpointContextMenu()}
                      destroyPopupOnHide={true}
                      trigger={["contextMenu"]}
                      menu={{
                          items: props.scheduleApi.getCheckpointContextMenuItems(),
                          onClick: (arg) => {
                              const {key, keyPath, domEvent} = arg;
                              props.scheduleApi.onCheckpointContextMenuClick({
                                  key: key,
                                  keyPath: keyPath,
                                  domEvent: domEvent,
                                  isPast: isPast,
                                  isFuture: isFuture,
                                  isProcess: isProcess,
                                  checkpointApi: props.checkpointApi,
                                  scheduleApi: props.scheduleApi,
                              })
                          }
                      }}>
                <div className={`${fs_class}-timeline-checkpoint`} ref={timelineCheckpointRef}>
                    <div className={`${fs_class}-checkpoint-main`}>
                        <DropletIcon01 width={eventHeight} height={eventHeight} color={color}/>
                    </div>
                </div>
            </Dropdown>
        </div>
    )
}