import React, {useEffect} from "react";
import {ScheduleApi} from "../../models/schedule";
import {ResourceApi, ResourceAreaColumn} from "../../models/resource";

export const useResourceLaneMount = (
    resourceLaneCellRef: React.MutableRefObject<HTMLDivElement | null>,
    resourceAreaColumn: ResourceAreaColumn,
    scheduleApi: ScheduleApi,
    resourceApi: ResourceApi,
) => {
    useEffect(() => {
        const resourceLaneCell = resourceLaneCellRef.current;
        if (resourceLaneCell) {
            scheduleApi.resourceLaneDidMount({
                el: resourceLaneCell,
                scheduleApi: scheduleApi,
                resourceApi: resourceApi,
                label: resourceAreaColumn,
            });
            return () => {
                scheduleApi.resourceLaneWillUnmount({
                    el: resourceLaneCell,
                    scheduleApi: scheduleApi,
                    resourceApi: resourceApi,
                    label: resourceAreaColumn,
                });
            }
        } else {
            return () => {
            }
        }
    }, [resourceLaneCellRef, resourceAreaColumn, scheduleApi, resourceApi]);
}