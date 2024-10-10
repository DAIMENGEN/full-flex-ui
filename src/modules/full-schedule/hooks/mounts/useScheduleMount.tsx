import {MutableRefObject, useEffect} from "react";
import {ScheduleView} from "../../models/schedule-view";

export const useScheduleMount = (scheduleElRef: MutableRefObject<HTMLDivElement | null>, scheduleView: ScheduleView) => {
    useEffect(() => {
        const scheduleEl = scheduleElRef.current;
        const scheduleApi = scheduleView.getScheduleApi();
        if (scheduleEl) {
            scheduleApi.scheduleDidMount({
                el: scheduleEl,
                scheduleApi: scheduleApi
            });
            return () => {
                scheduleApi.scheduleWillUnmount({
                    el: scheduleEl,
                    scheduleApi: scheduleApi,
                });
            }
        }
        return () => {}
    }, [scheduleView]);
}