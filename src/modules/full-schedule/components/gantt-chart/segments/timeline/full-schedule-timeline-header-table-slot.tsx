import React from "react";
import dayjs from "dayjs";
import {fs_class} from "../../../../constants";

export const FullScheduleTimelineHeaderTableSlot: React.FC<{date: dayjs.Dayjs, level: number, colSpan: number, timeText: string, dataDate: string, classNames: Array<string>}> = (props) => {
    return (
        <th colSpan={props.colSpan} data-date={props.dataDate} className={`${fs_class}-timeline-slot ${fs_class}-timeline-slot-label`}>
            <div className={`${fs_class}-timeline-slot-frame ${props.classNames.join(" ")}`} style={{border: "none", cursor: "pointer"}}>
                <span title={props.dataDate} className={`${fs_class}-timeline-slot-cushion ${fs_class}-scrollgrid-sync-inner`}>
                    {props.timeText}
                </span>
            </div>
        </th>
    )
}