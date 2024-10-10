import React from "react";
import dayjs from "dayjs";
import {ScheduleApi} from "../../schedule";
import {Position} from "../../../../../common/models/common";
import {ResourceApi} from "../../resource";
import {fs_class} from "../../../constants";
import {
    FullScheduleTimelineEventHarness
} from "../../../components/gantt-chart/segments/timeline/full-schedule-timeline-event-harness";
import {
    FullScheduleTimelineMilestoneHarness
} from "../../../components/gantt-chart/segments/timeline/full-schedule-timeline-milestone-harness";
import {
    FullScheduleTimelineCheckpointHarness
} from "../../../components/gantt-chart/segments/timeline/full-schedule-timeline-checkpoint-harness";
import {FullScheduleTimelineLane} from "../../../components/gantt-chart/segments/timeline/full-schedule-timeline-lane";
import {TimelineApi} from "../timeline";

export abstract class TimelineView {

    private readonly scheduleApi: ScheduleApi;

    constructor(scheduleApi: ScheduleApi) {
        this.scheduleApi = scheduleApi;
    }

    getScheduleApi(): ScheduleApi {
        return this.scheduleApi;
    }

    getTimelineApi(): TimelineApi {
        return this.scheduleApi.getTimelineApi();
    }

    renderLane(resourceApi: ResourceApi, timelineWidth: number): React.ReactNode {
        return (
            <FullScheduleTimelineLane scheduleApi={this.scheduleApi} resourceApi={resourceApi} timelineWidth={timelineWidth}/>
        )
    }

    renderEvents(resourceApi: ResourceApi, timelineWidth: number): React.ReactNode {
        const timelineApi = this.scheduleApi.getTimelineApi();
        const eventApis = resourceApi.getEventApis();
        return (
            <div className={`${fs_class}-timeline-events ${fs_class}-scrollgrid-sync-inner`}>
                {
                    eventApis.filter(eventApi => !eventApi.getStart().isAfter(timelineApi.getEnd()) && !eventApi.getEnd().getOrElse(timelineApi.getEnd()).isBefore(timelineApi.getStart())).map(eventApi => {
                        const position = this.calculatePosition(timelineWidth, eventApi.getStart(), eventApi.getEnd().getOrElse(timelineApi.getEnd()));
                        return (
                            <FullScheduleTimelineEventHarness key={eventApi.getId()}
                                                              eventApi={eventApi}
                                                              position={position}
                                                              resourceApi={resourceApi}
                                                              scheduleApi={this.scheduleApi}
                                                              timelineWidth={timelineWidth}/>
                        )
                    })
                }
            </div>
        )
    }

    renderMilestones(resource: ResourceApi, timelineWidth: number): React.ReactNode {
        const timelineApi = this.scheduleApi.getTimelineApi();
        const milestoneApis = resource.getMilestoneApis();
        return (
            <div className={`${fs_class}-timeline-milestones ${fs_class}-scrollgrid-sync-inner`}>
                {
                    milestoneApis.filter(milestoneApi => (milestoneApi.getTimestamp().isAfter(timelineApi.getStart(), "day") || milestoneApi.getTimestamp().isSame(timelineApi.getStart(), "day")) && milestoneApi.getTimestamp().isSameOrBefore(timelineApi.getEnd(), "day")).map(milestoneApi => {
                        const position = this.calculatePosition(timelineWidth, milestoneApi.getTimestamp(), milestoneApi.getTimestamp());
                        return <FullScheduleTimelineMilestoneHarness key={milestoneApi.getId()}
                                                                     position={position}
                                                                     milestoneApi={milestoneApi}
                                                                     timelineWidth={timelineWidth}
                                                                     scheduleApi={this.scheduleApi}/>
                    })
                }
            </div>
        );
    }

    renderCheckpoints(resource: ResourceApi, timelineWidth: number): React.ReactNode {
        const timelineApi = this.scheduleApi.getTimelineApi();
        const checkpointApis = resource.getCheckpointApis();
        return (
            <div className={`${fs_class}-timeline-checkpoints ${fs_class}-scrollgrid-sync-inner`}>
                {
                    checkpointApis.filter(checkpointApi => (checkpointApi.getTimestamp().isAfter(timelineApi.getStart(), "day") || checkpointApi.getTimestamp().isSame(timelineApi.getStart(), "day")) && checkpointApi.getTimestamp().isSameOrBefore(timelineApi.getEnd(), "day")).map(checkpointApi => {
                        const position = this.calculatePosition(timelineWidth, checkpointApi.getTimestamp(), checkpointApi.getTimestamp());
                        return <FullScheduleTimelineCheckpointHarness key={checkpointApi.getId()}
                                                                      position={position}
                                                                      timelineWidth={timelineWidth}
                                                                      checkpointApi={checkpointApi}
                                                                      scheduleApi={this.scheduleApi}/>
                    })
                }
            </div>
        );
    }

    calculateLaneHeight(resourceApi: ResourceApi): number {
        const milestoneNumbers = resourceApi.getMilestoneApis().length;
        if (milestoneNumbers === 0) {
            return this.scheduleApi.getLineHeight();
        } else {
            return this.scheduleApi.getLineHeight() * 1.5;
        }
    }

    calculateEventHeight(): number {
        return this.scheduleApi.getLineHeight() * 0.7;
    }

    abstract renderColgroup(): React.ReactNode;

    abstract renderBodySlots(): React.ReactNode;

    abstract renderHeaderSlots(): React.ReactNode;

    abstract calculateDate(timelineWidth: number, point: number): dayjs.Dayjs;

    abstract calculateSlotWidth(timelineWidth: number): number;

    abstract calculatePosition(timelineWidth: number, start: dayjs.Dayjs, end: dayjs.Dayjs): Position;

}