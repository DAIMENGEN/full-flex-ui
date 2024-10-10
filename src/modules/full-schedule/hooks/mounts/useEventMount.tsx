import React, {useEffect} from "react";
import {ScheduleApi} from "../../models/schedule";
import {EventApi} from "../../models/event";
import dayjs from "dayjs";

export const useEventMount = (
    timelineEventRef: React.MutableRefObject<HTMLDivElement | null>,
    scheduleApi: ScheduleApi,
    eventApi: EventApi,
) => {
    const timelineApi = scheduleApi.getTimelineApi();
    const startDate = eventApi.getStart();
    const endDate = eventApi.getEnd().getOrElse(timelineApi.getEnd());
    const isPast = endDate.isBefore(dayjs(), "day");
    const isFuture = startDate.isAfter(dayjs(), "day");
    const isProcess = startDate.isSameOrBefore(dayjs(), "day") && (endDate.isAfter(dayjs(), "day") || endDate.isSame(dayjs(), "day"));
    useEffect(() => {
        const timelineEvent = timelineEventRef.current;
        if (timelineEvent) {
            scheduleApi.eventDidMount({
                el: timelineEvent,
                isPast: isPast,
                isFuture: isFuture,
                isProcess: isProcess,
                eventApi: eventApi,
                scheduleApi: scheduleApi,
            });
            return () => {
                scheduleApi.eventWillUnmount({
                    el: timelineEvent,
                    isPast: isPast,
                    isFuture: isFuture,
                    isProcess: isProcess,
                    eventApi: eventApi,
                    scheduleApi: scheduleApi,
                });
            }
        } else {
            return () => {}
        }
    }, [timelineEventRef, scheduleApi, eventApi]);
    return {isPast, isFuture, isProcess};
}