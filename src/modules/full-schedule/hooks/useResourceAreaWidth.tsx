import {MutableRefObject, useEffect} from "react";

export const useResourceAreaWidth = (resourceAreaColRef: MutableRefObject<HTMLTableColElement | null>, resourceAreaWidth?: string) => {
    useEffect(() => {
        const resourceAreaCol = resourceAreaColRef.current;
        if (resourceAreaCol && resourceAreaWidth) {
            resourceAreaCol.style.width = resourceAreaWidth;
        }
        return () => {}
    }, [resourceAreaWidth]);
}