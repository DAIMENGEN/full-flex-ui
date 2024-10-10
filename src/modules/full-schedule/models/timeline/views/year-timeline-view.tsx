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

export class YearTimelineView extends TimelineView {

    renderColgroup(): React.ReactNode {
        const scheduleApi = this.getScheduleApi();
        const timelineApi = this.getTimelineApi();
        const years = timelineApi.getYears();
        const slotMinWidth = scheduleApi.getSlotMinWidth();
        return <FullScheduleTimelineTableColgroup dates={years} minWidth={slotMinWidth}/>;
    }

    renderBodySlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const years = timelineApi.getYears();
        return (
            <tbody>
            <tr role={row}>
                {
                    years.map(date => (
                        <FullScheduleTimelineBodyTableSlot key={date.year()}
                                                           date={date}
                                                           dataDate={date.year().toString()}
                                                           classNames={[`${fs_class}-year`]}/>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderHeaderSlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const years = timelineApi.getYears();
        return (
            <tbody>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    years.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={date.year()}
                                                             level={1}
                                                             date={date}
                                                             dataDate={date.year().toString()}
                                                             colSpan={1}
                                                             timeText={date.year().toString()}
                                                             classNames={[`${fs_class}-year`]}/>
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
        const date = timelineApi.getYears().at(index);
        if (!date) {
            throw new RangeError("Calculated index is out of bounds.")
        }
        return date;
    }

    calculateSlotWidth(timelineWidth: number): number {
        const timelineApi = this.getTimelineApi();
        const years = timelineApi.getYears();
        return timelineWidth / years.length;
    }

    calculatePosition(timelineWidth: number, start: dayjs.Dayjs, end: dayjs.Dayjs): Position {
        const timelineApi = this.getTimelineApi();
        const years = timelineApi.getYears();
        const yearCellWidth = timelineWidth / years.length;
        // Determine the start and end dates within the timeline range;
        const _start = start.isBefore(timelineApi.getStart()) ? timelineApi.getStart() : start;
        const _end = end.isAfter(timelineApi.getEnd()) ? timelineApi.getEnd() : end;
        // Calculate left position;
        const start_total_days = _start.endOf("year").diff(_start.startOf("year"), "day") + 1;
        const startDate = _start.diff(_start.startOf("year"), "day");
        const width_1 = yearCellWidth / start_total_days;
        const leftOffset = startDate * width_1;
        const yearLeft = timelineApi.getYearPosition(_start) * yearCellWidth;
        const left = start.isSameOrBefore(timelineApi.getStart(), "day") ? yearLeft : yearLeft + leftOffset;
        // Calculate right position;
        const end_total_days = _end.endOf("year").diff(_end.startOf("year"), "day") + 1;
        const endDate = _end.endOf("year").diff(_end, "day");
        const width_2 = yearCellWidth / end_total_days;
        const rightOffset = endDate * width_2;
        const yearRight = (timelineApi.getYearPosition(_end) + 1) * yearCellWidth * -1;
        const right = end.isBefore(timelineApi.getEnd(), "day") ? yearRight + rightOffset : yearRight;

        return {left, right};
    }
}