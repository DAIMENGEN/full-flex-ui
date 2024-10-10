import React from "react";
import {ScheduleView} from "../../../../models/schedule-view";
import {fs_class} from "../../../../constants";

export const FullScheduleTimelineBodyTable: React.FC<{scheduleView: ScheduleView}> = ({scheduleView}) => {

    return (
        <div id={`${fs_class}-timeline-slots`} className={`${fs_class}-timeline-slots`}>
            <table aria-hidden={true}>
                {scheduleView.renderTimelineTableColgroup()}
                {scheduleView.renderTimelineBodyTableSlots()}
            </table>
        </div>
    )
}