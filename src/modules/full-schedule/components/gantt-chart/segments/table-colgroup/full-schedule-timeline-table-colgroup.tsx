import React from "react";
import dayjs from "dayjs";

export const FullScheduleTimelineTableColgroup: React.FC<{dates: Array<dayjs.Dayjs>, minWidth: number}> = ({dates, minWidth}) => {
    return (
        <colgroup>
            {
                dates.map(date => <col key={date.format("YYYY-MM-DD")} style={{minWidth: minWidth}}/>)
            }
        </colgroup>
    )
}