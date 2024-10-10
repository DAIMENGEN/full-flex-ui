import Icon from "@ant-design/icons/lib/components/Icon";
import React from "react";
import {StyleUtil} from "../utils/style-util";

export const DragIcon01: React.FC<{width: number, height: number, color: string}> = (props) => {
    const drag = () => (
        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width={`${StyleUtil.numberToPixels(props.width)}`} height={`${StyleUtil.numberToPixels(props.height)}`}>
            <path d="M368 0h32v1024h-32zM496 0h32v1024h-32zM624 0h32v1024h-32z" fill={props.color}></path>
        </svg>
    )
    return <Icon component={drag} {...props}/>
}