import React, {useEffect} from "react";
import {ScheduleApi} from "../../models/schedule";
import {CheckpointApi} from "../../models/checkpoint";
import dayjs from "dayjs";

export const useCheckpointMount = (
    timelineCheckpointRef: React.MutableRefObject<HTMLDivElement | null>,
    scheduleApi: ScheduleApi,
    checkpointApi: CheckpointApi,
    ) => {
    const timestamp = checkpointApi.getTimestamp();
    const isPast = timestamp.isBefore(dayjs(), "day");
    const isFuture = timestamp.isAfter(dayjs(), "day");
    const isProcess = timestamp.isSame(dayjs(), "day");
    useEffect(() => {
        const timelineCheckpoint = timelineCheckpointRef.current;
        if (timelineCheckpoint) {
            scheduleApi.checkpointDidMount({
                el: timelineCheckpoint,
                isPast: isPast,
                isFuture: isFuture,
                isProcess: isProcess,
                checkpointApi: checkpointApi,
                scheduleApi: scheduleApi,
            });
            return () => {
                scheduleApi.checkpointWillUnmount({
                    el: timelineCheckpoint,
                    isPast: isPast,
                    isFuture: isFuture,
                    isProcess: isProcess,
                    checkpointApi: checkpointApi,
                    scheduleApi: scheduleApi,
                });
            }
        } else {
            return () => {}
        }
    }, [scheduleApi, checkpointApi]);
    return {isPast, isFuture, isProcess};
}