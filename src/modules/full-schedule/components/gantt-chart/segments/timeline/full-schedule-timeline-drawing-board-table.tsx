import React from "react";
import {fs_class} from "../../../../constants";
import {ScheduleView} from "../../../../models/schedule-view";
import {useTimelineWidth} from "../../../../hooks/useTimelineWidth";
import {useFullScheduleSelector} from "../../../../features/full-schedule-hook";
import {StyleUtil} from "../../../../../../common/utils/style-util";

export const FullScheduleTimelineDrawingBoardTable: React.FC<{scheduleView: ScheduleView}> = ({scheduleView}) => {
    const timelineWidth = useTimelineWidth();
    const collapseIds = useFullScheduleSelector((state) => state.resourceState.collapseIds);
    return (
        <table aria-hidden={true} className={`${fs_class}-timeline-drawing-board ${fs_class}-scrollgrid-sync-table`} style={{width: StyleUtil.numberToPixels(timelineWidth)}}>
            {scheduleView.renderTimelineDrawingBoardTable(collapseIds, timelineWidth)}
        </table>
    )
}