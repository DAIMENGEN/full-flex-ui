import React from "react";
import {ResourceAreaColumn} from "../../../../models/resource";

export const FullScheduleResourceTableColgroup: React.FC<{ resourceAreaColumns: ResourceAreaColumn[] }> = ({resourceAreaColumns}) => {
    return (
        <colgroup>
            {
                resourceAreaColumns.map(column => <col key={column.field} style={{minWidth: 100}}/>)
            }
        </colgroup>
    )
}