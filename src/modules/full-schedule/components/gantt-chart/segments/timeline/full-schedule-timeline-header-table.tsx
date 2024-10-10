import React from "react";
import {fs_class} from "../../../../constants";
import {ScheduleView} from "../../../../models/schedule-view";

export const FullScheduleTimelineHeaderTable: React.FC<{scheduleView: ScheduleView}> = ({scheduleView}) => {


    return (
        <table aria-hidden={true} className={`${fs_class}-scrollgrid-sync-table`}>
            {scheduleView.renderTimelineTableColgroup()}
            {scheduleView.renderTimelineHeaderTableSlots()}
        </table>
    )
}