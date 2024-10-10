import React from "react";
import dayjs from "dayjs";
import {TimelineView} from "./timeline-view";
import {Position} from "../../../../../common/models/common";
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

export class DayTimelineView extends TimelineView {

    renderColgroup(): React.ReactNode {
        const scheduleApi = this.getScheduleApi();
        const timelineApi = this.getTimelineApi();
        const days = timelineApi.getDays();
        const slotMinWidth = scheduleApi.getSlotMinWidth();
        return <FullScheduleTimelineTableColgroup dates={days} minWidth={slotMinWidth}/>;
    }

    renderBodySlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const days = timelineApi.getDays();
        return (
            <tbody>
            <tr role={row}>
                {
                    days.map(date => (
                        <FullScheduleTimelineBodyTableSlot key={date.format("YYYY-MM-DD")}
                                                           date={date}
                                                           dataDate={date.format("YYYY-MM-DD")}
                                                           classNames={[`${fs_class}-day`, timelineApi.isHoliday(date) ? `${fs_class}-holiday` : '']}/>
                        ))
                }
            </tr>
            </tbody>
        );
    }

    renderHeaderSlots(): React.ReactNode {
        const timelineApi = this.getTimelineApi();
        const days = timelineApi.getDays();
        const months = timelineApi.populateMonthsWithDays();
        const years = timelineApi.populateYearsWithDays();
        return (
            <tbody>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    years.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={date.year.year()}
                                                             level={1}
                                                             date={date.year}
                                                             dataDate={date.year.year().toString()}
                                                             colSpan={date.days.length}
                                                             timeText={date.year.year().toString()}
                                                             classNames={[`${fs_class}-year`]}/>
                    ))
                }
            </tr>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    months.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={`${date.month.format("YYYY-MM")}`}
                                                             level={2}
                                                             date={date.month}
                                                             dataDate={date.month.format("YYYY-MM")}
                                                             colSpan={date.days.length}
                                                             timeText={date.month.format("MMM")}
                                                             classNames={[`${fs_class}-month`]}/>
                    ))
                }
            </tr>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    days.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={date.format("YYYY-MM-DD")}
                                                             level={3}
                                                             date={date}
                                                             dataDate={date.format("YYYY-MM-DD")}
                                                             colSpan={1}
                                                             timeText={date.format("ddd")}
                                                             classNames={[`${fs_class}-day`, timelineApi.isHoliday(date) ? `${fs_class}-holiday` : '']}/>
                    ))
                }
            </tr>
            <tr role={row} className={`${fs_class}-timeline-header-row`}>
                {
                    days.map(date => (
                        <FullScheduleTimelineHeaderTableSlot key={date.format("YYYY-MM-DD")}
                                                             level={4}
                                                             date={date}
                                                             dataDate={date.format("YYYY-MM-DD")}
                                                             colSpan={1}
                                                             timeText={date.format("DD")}
                                                             classNames={[`${fs_class}-day`, timelineApi.isHoliday(date) ? `${fs_class}-holiday` : '']}/>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    calculateDate(timelineWidth: number, point: number): dayjs.Dayjs {
        const timelineApi = this.getTimelineApi();
        const slotWidth = this.calculateSlotWidth(timelineWidth);
        const index = Math.ceil((point / slotWidth) - 1);
        const date = timelineApi.getDays().at(index);
        if (!date) {
            throw new RangeError("Calculated index is out of bounds.")
        }
        return date;
    }

    calculateSlotWidth(timelineWidth: number): number {
        const timelineApi = this.getTimelineApi();
        const days = timelineApi.getDays();
        return timelineWidth / days.length;
    }

    calculatePosition(timelineWidth: number, start: dayjs.Dayjs, end: dayjs.Dayjs): Position {
        const timeline = this.getTimelineApi();
        const dayCellWidth = timelineWidth / timeline.getDays().length;
        const dayLeft = timeline.getDayPosition(start.isBefore(timeline.getStart()) ? timeline.getStart() : start) * dayCellWidth;
        const dayRight = (timeline.getDayPosition(end.isAfter(timeline.getEnd()) ? timeline.getEnd() : end) + 1) * dayCellWidth * -1;
        return {left: dayLeft, right: dayRight};
    }
}