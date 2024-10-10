import {useRef, useState} from "react";
import {DraggableData, DraggableEvent} from "react-draggable";

export const useDraggableOnStart = () => {
    const draggableRef = useRef<HTMLDivElement>(null);
    const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        if (draggableRef) {
            const {clientWidth, clientHeight} = window.document.documentElement;
            const targetRect = draggableRef.current?.getBoundingClientRect();
            if (!targetRect) {
                return;
            }
            setBounds({
                left: -targetRect.left + uiData.x,
                right: clientWidth - (targetRect.right - uiData.x),
                top: -targetRect.top + uiData.y,
                bottom: clientHeight - (targetRect.bottom - uiData.y),
            });
        }
    };
    return {draggableRef, bounds, onStart}
}