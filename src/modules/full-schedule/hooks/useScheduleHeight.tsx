import {useEffect} from "react";
import {StyleUtil} from "../../../common/utils/style-util";
import {fs_class} from "../constants";

export const useScheduleHeight = (scheduleMaxHeight: number) => {
  useEffect(() => {
      const scheduleViewHarness = document.getElementById(`${fs_class}-view-harness`);
      const scheduleDataGridBody = document.getElementById(`${fs_class}-datagrid-body`);
      const scheduleTimelineHeader = document.getElementById(`${fs_class}-timeline-header`);
      const bodyHeight = scheduleDataGridBody ? scheduleDataGridBody.getBoundingClientRect().height : 0;
      const headerHeight = scheduleTimelineHeader ? scheduleTimelineHeader.getBoundingClientRect().height : 0;
      const height = bodyHeight + headerHeight + 13;
      const scheduleHeight = scheduleMaxHeight - height > 0 ? height : scheduleMaxHeight;
      scheduleViewHarness && (scheduleViewHarness.style.height = StyleUtil.numberToPixels(scheduleHeight));
      const resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
              const newHeight = entry.contentRect.height + headerHeight + 13;
              const scheduleHeight = scheduleMaxHeight - newHeight > 0 ? newHeight : scheduleMaxHeight;
              scheduleViewHarness && (scheduleViewHarness.style.height = StyleUtil.numberToPixels(scheduleHeight));
          }
      });
      scheduleDataGridBody && resizeObserver.observe(scheduleDataGridBody);
      return () => {
          resizeObserver.disconnect();
      }
  }, [scheduleMaxHeight])
}