import {Key} from "react";

export type TreeNode = {
    id: string;
    title: string;
    order?: number;
    parentId?: string;
}

export type CheckValues = Array<Key> | {
    checked: Array<Key>;
    halfChecked: Array<Key>;
}

export type TreeAdjusterProps = {
    treeNodes: Array<TreeNode>;
    onAdjust: (childrenIds: Array<string>, parentId?: string) => void;
}

