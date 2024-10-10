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

export class QuarterTimelineView extends TimelineView {

    renderColgroup(): React.ReactNode {
        const scheduleApi = this.getScheduleApi();
        const timelineApi = this.getTimelineApi();
        const quarters = timelineApi.getQuarters();
        const slotMinWidth = scheduleApi.getSlotMinWidth();
        return <FullScheduleTimelineTableColgroup dates={quarters} minWidth={slotMinWidth}/>;
    }

    renderBodySlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const quarters = timelineApi.getQuarters();
        return (
            <tbody>
            <tr role={row}>
                {
                    quarters.map(date => (
                        <FullScheduleTimelineBodyTableSlot key={`${date.year()}-Q${date.quarter()}`}
                                                           date={date}
                                                           dataDate={`${date.year()}-Q${date.quarter()}`}
                                                           classNames={[`${fs_class}-quarter`]}/>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderHeaderSlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const quarters = timelineApi.getQuarters();
        const years = timelineApi.populateYearsWithQuarters();
        return (
            <tbody>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    years.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={date.year.year()}
                                                             level={1}
                                                             date={date.year}
                                                             dataDate={date.year.year().toString()}
                                                             colSpan={date.quarters.length}
                                                             timeText={date.year.year().toString()}
                                                             classNames={[`${fs_class}-year`]}/>
                    ))
                }
            </tr>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    quarters.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={`${date.year()}-Q${date.quarter()}`}
                                                             level={2}
                                                             date={date}
                                                             dataDate={`${date.year()}-Q${date.quarter()}`}
                                                             colSpan={1}
                                                             timeText={`Q${date.quarter()}`}
                                                             classNames={[`${fs_class}-quarter`]}/>
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
        const date = timelineApi.getQuarters().at(index);
        if (!date) {
            throw new RangeError("Calculated index is out of bounds.")
        }
        return date;
    }

    calculateSlotWidth(timelineWidth: number): number {
        const timelineApi = this.getTimelineApi();
        const quarters = timelineApi.getQuarters();
        return timelineWidth / quarters.length;
    }

    calculatePosition(timelineWidth: number, start: dayjs.Dayjs, end: dayjs.Dayjs): Position {
        const timelineApi = this.getTimelineApi();
        const quarters = timelineApi.getQuarters();
        const quarterCellWidth = timelineWidth / quarters.length;
        // Determine the start and end dates within the timeline range;
        const _start = start.isBefore(timelineApi.getStart()) ? timelineApi.getStart() : start;
        const _end = end.isAfter(timelineApi.getEnd()) ? timelineApi.getEnd() : end;
        // Calculate left position;
        const start_total_days = _start.endOf("quarter").diff(_start.startOf("quarter"), "day") + 1;
        const startDate = start.diff(_start.startOf("quarter"), "day");
        const width_1 = quarterCellWidth / start_total_days;
        const leftOffset = startDate * width_1;
        const quarterLeft = timelineApi.getQuarterPosition(_start) * quarterCellWidth;
        const left = start.isSameOrBefore(timelineApi.getStart(), "day") ? quarterLeft : quarterLeft + leftOffset;
        // Calculate right position;
        const end_total_days = _end.endOf("quarter").diff(_end.startOf("quarter"), "day") + 1;
        const endDate = _end.endOf("quarter").diff(_end, "day");
        const width_2 = quarterCellWidth / end_total_days;
        const rightOffset = endDate * width_2;
        const quarterRight = (timelineApi.getQuarterPosition(_end) + 1) * quarterCellWidth * -1;
        const right = end.isBefore(timelineApi.getEnd(), "day") ? quarterRight + rightOffset : quarterRight;

        return {left, right};
    }
}