import React, {useState} from "react";
import {Modal} from "antd";
import Draggable from "react-draggable";
import {DraggableModalProps} from "../models";
import {useDraggableOnStart} from "../hooks/useDraggableOnStart";
import {fdm_class} from "../constants";

export const FullDraggableModal: React.FC<DraggableModalProps> = (props) => {
    const [disabled, setDisabled] = useState(true);
    const {draggableRef, bounds, onStart} = useDraggableOnStart();
    return (
        <Modal {...props}
               className={`${fdm_class}`}
               title={
                   <div style={{width: "100%", cursor: "move"}}
                        onBlur={() => {
                        }}
                        onFocus={() => {
                        }}
                        onMouseOver={() => disabled && setDisabled(false)}
                        onMouseOut={() => setDisabled(true)}>
                       {props.title}
                   </div>}
               modalRender={(modal) => (
                   <Draggable disabled={disabled}
                              bounds={bounds}
                              nodeRef={draggableRef}
                              onStart={(event, uiData) => onStart(event, uiData)}>
                       <div ref={draggableRef}>
                           {modal}
                       </div>
                   </Draggable>
               )}>
            {props.children}
        </Modal>
    )
}