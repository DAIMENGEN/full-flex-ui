import React, {useEffect} from "react";

export const useSyncScroll = (
    mainContainer:  React.RefObject<HTMLDivElement>,
    otherContainers: Array<React.RefObject<HTMLDivElement>>,
    type: string) => {
  useEffect(() => {
      const current = mainContainer.current;
      if (current) {
          current.addEventListener("scroll", e => {
              const element = e.target as HTMLElement;
              otherContainers.forEach(other => {
                  const container = other.current;
                  switch (type) {
                      case "left":
                          if (container) {
                              container.scroll({
                                  left: element.scrollLeft
                              });
                          }
                          break;
                      case "top":
                          if (container) {
                              container.scroll({
                                  top: element.scrollTop
                              });
                          }
                          break;
                      default:
                          break;
                  }
              })
          });
      }
  }, [mainContainer, otherContainers, type]);
}