import React from "react";
import dayjs from "dayjs";
import {fs_class} from "../../../../constants";

export const FullScheduleTimelineBodyTableSlot: React.FC<{ date: dayjs.Dayjs, dataDate: string, classNames: Array<string> }> = (props) => {
    return (
        <td key={props.date.format("YYYY-MM-DD")} data-date={props.dataDate} className={`${fs_class}-timeline-slot ${fs_class}-timeline-slot-lane`}>
            <div className={`${fs_class}-timeline-slot-frame ${props.classNames?.join(" ")}`}></div>
        </td>
    )
}