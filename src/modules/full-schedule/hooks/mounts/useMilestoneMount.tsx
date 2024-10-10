import React, {useEffect} from "react";
import {ScheduleApi} from "../../models/schedule";
import {MilestoneApi} from "../../models/milestone";
import dayjs from "dayjs";

export const useMilestoneMount = (
    timelineMilestoneRef: React.MutableRefObject<HTMLDivElement | null>,
    scheduleApi: ScheduleApi,
    milestoneApi: MilestoneApi,
) => {
    const timestamp = milestoneApi.getTimestamp();
    const isPast = timestamp.isBefore(dayjs(), "day");
    const isFuture = timestamp.isAfter(dayjs(), "day");
    const isProcess = timestamp.isSame(dayjs(), "day");
    useEffect(() => {
        const timelineMilestone = timelineMilestoneRef.current;
        if (timelineMilestone) {
            scheduleApi.milestoneDidMount({
                el: timelineMilestone,
                isPast: isPast,
                isFuture: isFuture,
                isProcess: isProcess,
                milestoneApi: milestoneApi,
                scheduleApi: scheduleApi,
            });
            return () => {
                scheduleApi.milestoneWillUnmount({
                    el: timelineMilestone,
                    isPast: isPast,
                    isFuture: isFuture,
                    isProcess: isProcess,
                    milestoneApi: milestoneApi,
                    scheduleApi: scheduleApi,
                });
            }
        }
        return () => {}
    }, [scheduleApi, milestoneApi]);
    return {isPast, isFuture, isProcess};
}