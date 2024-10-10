import React from "react";
import {fs_class, presentation} from "../../../../constants";
import {ScheduleView} from "../../../../models/schedule-view";
import {useFullScheduleSelector} from "../../../../features/full-schedule-hook";

export const FullScheduleDatagridBody: React.FC<{ scheduleView: ScheduleView }> = ({scheduleView}) => {
    const collapseIds = useFullScheduleSelector((state) => state.resourceState.collapseIds);
    return (
        <table role={presentation} id={`${fs_class}-datagrid-body`} className={`${fs_class}-datagrid-body ${fs_class}-scrollgrid-sync-table`}>
            {scheduleView.renderResourceTableColgroup()}
            {scheduleView.renderResourceLane(collapseIds)}
        </table>
    )
}