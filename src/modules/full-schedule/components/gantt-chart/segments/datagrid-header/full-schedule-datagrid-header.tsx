import React from "react";
import {fs_class, presentation} from "../../../../constants";
import {ScheduleView} from "../../../../models/schedule-view";

export const FullScheduleDatagridHeader: React.FC<{ scheduleView: ScheduleView }> = ({scheduleView}) => {
    return (
        <table role={presentation} className={`${fs_class}-datagrid-header ${fs_class}-scrollgrid-sync-table`}>
            {scheduleView.renderResourceTableColgroup()}
            {scheduleView.renderResourceLabel()}
        </table>
    )
}