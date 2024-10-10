import React from "react";
import {StyleUtil} from "../utils/style-util";
import Icon from "@ant-design/icons/lib/components/Icon";

export const DropletIcon01: React.FC<{width: number, height: number, color: string}> = (props) => {
    const droplet = () => (
        <svg className="droplet-icon-01" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width={`${StyleUtil.numberToPixels(props.width)}`} height={`${StyleUtil.numberToPixels(props.height)}`}>
            <path d="m384.22745,733.52328c0,44.11394 60.77782,79.84905 135.74964,79.84905s135.74964,-35.76637 135.74964,-79.84905s-60.77782,-79.84905 -135.74964,-79.84905s-135.74964,35.73511 -135.74964,79.84905z" fill="#fef8f8"></path>
            <path d="m519.91456,697.78863l-177.9252,-204.81251a337.99847,337.99847 0 0 1 -97.70097,-204.53112a252.67817,252.67817 0 0 1 71.47021,-204.65619a288.19443,288.19443 0 0 1 408.31192,0a252.7407,252.7407 0 0 1 71.43895,204.68745a338.09227,338.09227 0 0 1 -97.70098,204.68745l-177.89393,204.59366l0,0.03126zm-4.34574,-636.10369a207.62629,207.62629 0 1 0 207.6263,207.6263a207.87641,207.87641 0 0 0 -207.6263,-207.6263z" fill={props.color}></path>
            <path d="M 517,116 A 154,154 0 1 1 517,424 A 154,154 0 1 1 517,116 Z" fill={props.color}></path>
        </svg>
    )
    return <Icon component={droplet} {...props} />
}   