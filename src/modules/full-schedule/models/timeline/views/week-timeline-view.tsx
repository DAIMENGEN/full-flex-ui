import React from "react";
import dayjs from "dayjs";
import {TimelineView} from "./timeline-view";
import {
    FullScheduleTimelineTableColgroup
} from "../../../components/gantt-chart/segments/table-colgroup/full-schedule-timeline-table-colgroup";
import {fs_class, row} from "../../../constants";
import {
    FullScheduleTimelineBodyTableSlot
} from "../../../components/gantt-chart/segments/timeline/full-schedule-timeline-body-table-slot";
import {
    FullScheduleTimelineHeaderTableSlot
} from "../../../components/gantt-chart/segments/timeline/full-schedule-timeline-header-table-slot";
import {Position} from "../../../../../common/models/common";

export class WeekTimelineView extends TimelineView {

    renderColgroup(): React.ReactNode {
        const scheduleApi = this.getScheduleApi();
        const timelineApi = this.getTimelineApi();
        const weeks = timelineApi.getWeeks();
        const slotMinWidth = scheduleApi.getSlotMinWidth();
        return <FullScheduleTimelineTableColgroup dates={weeks} minWidth={slotMinWidth}/>;
    }

    renderBodySlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const weeks = timelineApi.getWeeks();
        return (
            <tbody>
            <tr role={row}>
                {
                    weeks.map(date => (
                        <FullScheduleTimelineBodyTableSlot key={`${date.format("YYYY-MM-DD")}`}
                                                           date={date}
                                                           dataDate={`${date.format("YYYY-MM-DD")}`}
                                                           classNames={[`${fs_class}-week`]}/>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderHeaderSlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const weeks = timelineApi.getWeeks();
        return (
            <tbody>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    weeks.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={`${date.format("YYYY-MM-DD")}`}
                                                             level={2}
                                                             date={date}
                                                             dataDate={`${date.format("YYYY-MM-DD")}`}
                                                             colSpan={1}
                                                             timeText={`W${date.week().toString().padStart(2, '0')}`}
                                                             classNames={[`${fs_class}-week`]}/>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    calculateDate(timelineWidth: number, point: number): dayjs.Dayjs {
        const timelineApi = this.getTimelineApi();
        const slotWidth = this.calculateSlotWidth(timelineWidth);
        const index = (point / slotWidth) - 1;
        const date = timelineApi.getWeeks().at(index);
        if (!date) {
            throw new RangeError("Calculated index is out of bounds.")
        }
        return date;
    }

    calculateSlotWidth(timelineWidth: number): number {
        const timelineApi = this.getTimelineApi();
        const weeks = timelineApi.getWeeks();
        return timelineWidth / weeks.length;
    }

    calculatePosition(timelineWidth: number, start: dayjs.Dayjs, end: dayjs.Dayjs): Position {
        const timelineApi = this.getTimelineApi();
        const weeks = timelineApi.getWeeks();
        const weekCellWidth = timelineWidth / weeks.length;
        // Determine the start and end dates within the timeline range;
        const _start = start.isBefore(timelineApi.getStart()) ? timelineApi.getStart() : start;
        const _end = end.isAfter(timelineApi.getEnd()) ? timelineApi.getEnd() : end;
        // Calculate ratio
        const ratio = weekCellWidth / 7;
        // Calculate left position;
        const startDate = _start.day();
        const weekLeft = timelineApi.getWeekPosition(_start) * weekCellWidth;
        const left = start.isSameOrBefore(timelineApi.getStart(), "day") ? weekLeft : weekLeft + (startDate * ratio);
        // Calculate right position;
        const endDate = 6 - _end.day();
        const weekRight = (timelineApi.getWeekPosition(_end) + 1) * weekCellWidth * -1;
        const right = end.isBefore(timelineApi.getEnd(), "day") ? weekRight + (endDate * ratio) : weekRight;
        return {left, right};
    }
}