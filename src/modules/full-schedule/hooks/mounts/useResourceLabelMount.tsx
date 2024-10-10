import React, {useEffect} from "react";
import {ResourceAreaColumn} from "../../models/resource";
import {ScheduleApi} from "../../models/schedule";

export const useResourceLabelMount = (
    resourceLabelCellRef: React.MutableRefObject<HTMLDivElement | null>,
    resourceAreaColumn: ResourceAreaColumn,
    scheduleApi: ScheduleApi,
) => {
    useEffect(() => {
        const resourceLabelCell = resourceLabelCellRef.current;
        if (resourceLabelCell) {
            scheduleApi.resourceLabelDidMount({
                el: resourceLabelCell,
                label: resourceAreaColumn,
            });
            return () => {
                scheduleApi.resourceLabelWillUnmount({
                    el: resourceLabelCell,
                    label: resourceAreaColumn,
                });
            }
        } else {
            return () => {
            }
        }
    }, [resourceLabelCellRef, resourceAreaColumn, scheduleApi]);
}