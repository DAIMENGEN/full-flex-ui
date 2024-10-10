import {TimelineView} from "./timeline-view";
import React from "react";
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
import dayjs from "dayjs";
import {Position} from "../../../../../common/models/common";

export class MonthTimelineView extends TimelineView {

    renderColgroup(): React.ReactNode {
        const scheduleApi = this.getScheduleApi();
        const timelineApi = this.getTimelineApi();
        const months = timelineApi.getMonths();
        const slotMinWidth = scheduleApi.getSlotMinWidth();
        return <FullScheduleTimelineTableColgroup dates={months} minWidth={slotMinWidth}/>;
    }

    renderBodySlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const months = timelineApi.getMonths();
        return (
            <tbody>
            <tr role={row}>
                {
                    months.map(date => (
                        <FullScheduleTimelineBodyTableSlot key={date.format("YYYY-MM")}
                                                           date={date}
                                                           dataDate={date.format("YYYY-MM")}
                                                           classNames={[`${fs_class}-month`]}/>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderHeaderSlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const months = timelineApi.getMonths();
        const years = timelineApi.populateYearsWithMonths();
        return (
            <tbody>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    years.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={date.year.year()}
                                                             level={1}
                                                             date={date.year}
                                                             dataDate={date.year.year().toString()}
                                                             colSpan={date.months.length}
                                                             timeText={date.year.year().toString()}
                                                             classNames={[`${fs_class}-year`]}/>
                    ))
                }
            </tr>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    months.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={date.format("YYYY-MM")}
                                                             level={2}
                                                             date={date}
                                                             dataDate={date.format("YYYY-MM")}
                                                             colSpan={1}
                                                             timeText={date.format("MMM")}
                                                             classNames={[`${fs_class}-month`]}/>
                    ))
                }
            </tr>
            </tbody>
        )
    }

    calculateDate(timelineWidth: number, point: number): dayjs.Dayjs {
        const timelineApi = this.getTimelineApi();
        const slotWidth = this.calculateSlotWidth(timelineWidth);
        const index = (point / slotWidth) - 1;
        const date = timelineApi.getMonths().at(index);
        if (!date) {
            throw new RangeError("Calculated index is out of bounds.")
        }
        return date;
    }

    calculateSlotWidth(timelineWidth: number): number {
        const timelineApi = this.getTimelineApi();
        const months = timelineApi.getMonths();
        return timelineWidth / months.length;
    }

    calculatePosition(timelineWidth: number, start: dayjs.Dayjs, end: dayjs.Dayjs): Position {
        const timelineApi = this.getTimelineApi();
        const months = timelineApi.getMonths();
        const monthCellWidth = timelineWidth / months.length;
        // Determine the start and end dates within the timeline range;
        const _start = start.isBefore(timelineApi.getStart()) ? timelineApi.getStart() : start;
        const _end = end.isAfter(timelineApi.getEnd()) ? timelineApi.getEnd() : end;
        // Calculate left position;
        const startDate = _start.date() - 1;
        const width_1 = (monthCellWidth / _start.daysInMonth());
        const monthLeft = timelineApi.getMonthPosition(_start) * monthCellWidth;
        const left = start.isSameOrBefore(timelineApi.getStart(), "day") ? monthLeft : monthLeft + (startDate * width_1);
        // Calculate right position;
        const endDate = _end.daysInMonth() - _end.date();
        const width_2 = (monthCellWidth / _end.daysInMonth());
        const monthRight = (timelineApi.getMonthPosition(_end) + 1) * monthCellWidth * -1;
        const right = end.isBefore(timelineApi.getEnd(), "day") ?  monthRight + (endDate * width_2) : monthRight;
        return {left, right};
    }
}