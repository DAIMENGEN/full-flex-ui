import React from "react";
import {StyleUtil} from "../utils/style-util";
import Icon from "@ant-design/icons/lib/components/Icon";

export const TriangleIcon01: React.FC<{ width: number, height: number, color: string }> = (props) => {
    const triangle = () => (
        <svg className="triangle-icon-01" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width={`${StyleUtil.numberToPixels(props.width)}`} height={`${StyleUtil.numberToPixels(props.height)}`}>
            <path d="M765.533 115.367c0-46.168-61.65-75.692-97.005-40.324L271.127 472.426c-22.791 22.791-22.791 56.687 0 79.477l397.4 397.396c34.469 34.481 97.006 7.598 97.006-39.74V115.367z" fill={props.color}></path>
        </svg>
    )
    return <Icon component={triangle} {...props}/>
}