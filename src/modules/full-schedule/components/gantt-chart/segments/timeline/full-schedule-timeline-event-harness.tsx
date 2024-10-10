import React, {useRef} from "react";
import {Dropdown} from "antd";
import {fs_class} from "../../../../constants";
import {EventApi} from "../../../../models/event";
import {Position} from "../../../../../../common/models/common";
import {StyleUtil} from "../../../../../../common/utils/style-util";
import {ResourceApi} from "../../../../models/resource";
import {ScheduleApi} from "../../../../models/schedule";
import {ConditionalRenderer} from "../../../../../../common/components/conditional-renderer";
import {DragIcon01} from "../../../../../../common/svg-icons/drag-icon-01";
import {TriangleIcon01} from "../../../../../../common/svg-icons/triangle-icon-01";
import {TriangleIcon02} from "../../../../../../common/svg-icons/triangle-icon-02";
import {useMoveTimelineEvent} from "../../../../hooks/useMoveTimelineEvent";
import {useEventMount} from "../../../../hooks/mounts/useEventMount";

export const FullScheduleTimelineEventHarness: React.FC<{scheduleApi: ScheduleApi, resourceApi: ResourceApi, eventApi: EventApi, timelineWidth: number, position: Position}> = (props) => {
    const timelineEventRef = useRef<HTMLDivElement | null>(null);
    const timelineEventHarnessRef = useRef<HTMLDivElement | null>(null);
    const timelineApi = props.scheduleApi.getTimelineApi();
    const timelineView = props.scheduleApi.getScheduleView().getTimelineView();
    const textColor = props.eventApi.getTextColor().getOrElse("white");
    const borderColor = props.eventApi.getBorderColor().getOrElse(props.eventApi.getColor());
    const backgroundColor = props.eventApi.getBackgroundColor().getOrElse(props.eventApi.getColor());
    const laneHeight = timelineView.calculateLaneHeight(props.resourceApi);
    const eventHeight = timelineView.calculateEventHeight();
    const top = (laneHeight - eventHeight) / 2 - 1;
    const {isPast, isFuture, isProcess} = useEventMount(timelineEventRef, props.scheduleApi, props.eventApi);
    const {handleMouseDown, leftHandleMouseDown, rightHandleMouseDown} = useMoveTimelineEvent({
        timelineEventHarnessRef: timelineEventHarnessRef,
        timelineWidth: props.timelineWidth,
        eventApi: props.eventApi,
        resourceApi: props.resourceApi,
        scheduleApi: props.scheduleApi
    });
    return (
        <div className={`${fs_class}-timeline-event-harness`} ref={timelineEventHarnessRef} style={{
            top: StyleUtil.numberToPixels(top),
            height: StyleUtil.numberToPixels(eventHeight),
            lineHeight: StyleUtil.numberToPixels(eventHeight),
            left: StyleUtil.numberToPixels(props.position.left),
            right: StyleUtil.numberToPixels(props.position.right),
        }}>
            <Dropdown disabled={!props.scheduleApi.isEnableEventContextMenu()}
                      destroyPopupOnHide={true}
                      trigger={["contextMenu"]}
                      menu={{
                          items: props.scheduleApi.getEventContextMenuItems(),
                          onClick: (arg) => {
                              const {key, keyPath, domEvent} = arg;
                              props.scheduleApi.onEventContextMenuClick({
                                  key: key,
                                  keyPath: keyPath,
                                  domEvent: domEvent,
                                  isPast: isPast,
                                  isFuture: isFuture,
                                  isProcess: isProcess,
                                  eventApi: props.eventApi,
                                  scheduleApi: props.scheduleApi,
                              });
                          }
                      }}>
                <div className={`${fs_class}-timeline-event`} style={{backgroundColor: backgroundColor, border: `1px solid ${borderColor}`}} ref={timelineEventRef}>
                    <ConditionalRenderer condition={props.scheduleApi.isEditable()}
                                         fallback={<ConditionalRenderer condition={props.eventApi.getStart().isBefore(timelineApi.getStart())}
                                                                        fallback={<div style={{ width: 10, height: eventHeight}}></div>}>
                                             <TriangleIcon01 width={10} height={eventHeight} color={`#FFFFFF`}/>
                                         </ConditionalRenderer>}>
                        <ConditionalRenderer condition={!props.eventApi.getStart().isBefore(timelineApi.getStart())}
                                             fallback={<TriangleIcon01 width={10} height={eventHeight} color={`#FFFFFF`}/>}>
                            <div className={`${fs_class}-event-resize-handle`}
                                 onMouseDown={leftHandleMouseDown}
                                 style={{ width: 10, height: eventHeight, cursor: "ew-resize"}}>
                                <DragIcon01 width={10} height={eventHeight} color={`#FFFFFF`}/>
                            </div>
                        </ConditionalRenderer>
                    </ConditionalRenderer>

                    <ConditionalRenderer condition={props.scheduleApi.isEditable() && !props.eventApi.getStart().isBefore(timelineApi.getStart()) && props.eventApi.getEnd().getOrElse(timelineApi.getEnd()).isSameOrBefore(timelineApi.getEnd())} fallback={
                        <div className={`${fs_class}-event-main`} style={{ color: textColor, width: "calc(100% - 20px)"}}>
                            <ConditionalRenderer condition={props.eventApi.getUrl().isDefined()} fallback={<span>{props.eventApi.getTitle()}</span>}>
                                {props.eventApi.getUrl().isDefined() && <a href={props.eventApi.getUrl().get()} style={{color: "inherit"}}>{props.eventApi.getTitle()}</a>}
                            </ConditionalRenderer>
                        </div>}>
                        <div className={`${fs_class}-event-main`} style={{ color: textColor, width: "calc(100% - 20px)", cursor: "grab"}} onMouseDown={handleMouseDown}>
                            <ConditionalRenderer condition={props.eventApi.getUrl().isDefined()} fallback={<span>{props.eventApi.getTitle()}</span>}>
                                {props.eventApi.getUrl().isDefined() && <a href={props.eventApi.getUrl().get()} style={{color: "inherit"}}>{props.eventApi.getTitle()}</a>}
                            </ConditionalRenderer>
                        </div>
                    </ConditionalRenderer>

                    <ConditionalRenderer condition={props.scheduleApi.isEditable()}
                                         fallback={<ConditionalRenderer condition={props.eventApi.getEnd().getOrElse(timelineApi.getEnd()).isAfter(timelineApi.getEnd())}
                                                                        fallback={<div style={{ width: 10, height: eventHeight}}></div>}>
                                             <TriangleIcon02 width={10} height={eventHeight} color={"#FFFFFF"}/>
                                         </ConditionalRenderer>}>
                        <ConditionalRenderer condition={props.eventApi.getEnd().getOrElse(timelineApi.getEnd()).isSameOrBefore(timelineApi.getEnd())}
                                             fallback={<TriangleIcon02 width={10} height={eventHeight} color={"#FFFFFF"}/>}>
                            <div className={`${fs_class}-event-resize-handle`}
                                 onMouseDown={rightHandleMouseDown}
                                 style={{ width: 10, height: eventHeight, cursor: "ew-resize" }}>
                                <DragIcon01 width={10} height={eventHeight} color={`#FFFFFF`}/>
                            </div>
                        </ConditionalRenderer>
                    </ConditionalRenderer>
                </div>
            </Dropdown>
        </div>
    )
}