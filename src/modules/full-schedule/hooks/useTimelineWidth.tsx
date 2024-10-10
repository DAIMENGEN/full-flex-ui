import {useCallback, useEffect, useState} from "react";
import {useFullScheduleSelector} from "../features/full-schedule-hook";
import {fs_class} from "../constants";

export const useTimelineWidth = () => {
    const getTimelineWidth = useCallback(() => {
        const elements = document.getElementsByClassName(`${fs_class}-timeline-header`);
        const element = elements.item(0) as HTMLElement;
        const table = element.getElementsByTagName("table").item(0);
        const timelineWidth = table?.offsetWidth;
        return timelineWidth ? timelineWidth : 0;
    }, []);
    const [width, setWidth] = useState(0);
    const resourceAreaWidth = useFullScheduleSelector(state => state.resourceState.resourceAreaWidth);
    useEffect(() => {
        setWidth(getTimelineWidth());
        const windowResizeListener = (_: UIEvent) => setWidth(getTimelineWidth());
        window.addEventListener("resize", windowResizeListener);
        return () => {
            window.removeEventListener("resize", windowResizeListener);
        }
    }, [getTimelineWidth, resourceAreaWidth]);
    return width;
}