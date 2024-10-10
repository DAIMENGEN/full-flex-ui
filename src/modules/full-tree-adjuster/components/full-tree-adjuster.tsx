import React, {Key, useCallback, useState} from "react";
import {Button, Card, Space, Tree, TreeDataNode, TreeProps} from "antd";
import {fta_class} from "../constants";
import {CheckValues, TreeAdjusterProps, TreeNode} from "../models";
import {ArrowRightOutlined, CloseOutlined} from "@ant-design/icons";
import {TreeUtil} from "../utils/tree-util";

export const FullTreeAdjuster: React.FC<TreeAdjusterProps> = (props) => {

    const [checkStrictly, setCheckStrictly] = useState<boolean>(false);

    const [leftCheckedKeys, setLeftCheckedKeys] = useState<Array<Key>>([]);

    const [rightCheckedKeys, setRightCheckedKeys] = useState<Array<Key>>([]);

    const [leftNodes, setLeftNodes] = useState<Array<TreeDataNode>>(TreeUtil.arrayToTree(props.treeNodes));

    const [rightNodes, setRightNodes] = useState<Array<TreeDataNode>>(TreeUtil.arrayToTree(props.treeNodes));

    const onLeftCheck: TreeProps["onCheck"] = useCallback((checkValues: CheckValues) => {
        setCheckStrictly(false);
        if (Array.isArray(checkValues)) {
            setRightNodes(rightNodes => {
                TreeUtil.traverseTree(rightNodes, node => {
                    node.disableCheckbox = checkValues.includes(node.key);
                });
                return rightNodes;
            });
            setLeftCheckedKeys(checkValues);
            setRightCheckedKeys(rightCheckedKeys => {
                return rightCheckedKeys.filter(rightCheckedKey => !checkValues.includes(rightCheckedKey));
            });
        }
    }, [setRightNodes, setLeftCheckedKeys, setRightCheckedKeys]);

    const onRightCheck: TreeProps["onCheck"] = useCallback((checkValues: CheckValues) => {
        if (!Array.isArray(checkValues)) {
            const checkedValue = checkValues.checked.at(0);
            setRightNodes(rightNodes => {
                TreeUtil.traverseTree(rightNodes, node => {
                    if (checkedValue) {
                        node.disableCheckbox = node.key !== checkedValue;
                    } else {
                        node.disableCheckbox = leftCheckedKeys.includes(node.key);
                    }
                });
                return rightNodes;
            });
            setRightCheckedKeys(checkedValue ? [checkedValue] : []);
        }
    }, [setRightNodes, leftCheckedKeys, setRightCheckedKeys]);

    const change = useCallback(() => {
        setCheckStrictly(true);
        const ancestorIds: Array<string> = [];
        // const treeNodes = [...props.treeNodes];
        const treeNodes: Array<TreeNode> = JSON.parse(JSON.stringify(props.treeNodes));
        const parentId = rightCheckedKeys.at(0);
        if (typeof parentId === "string" || typeof parentId === "undefined") {
            treeNodes.forEach(node => {
                if (leftCheckedKeys.includes(node.id)) {
                    if (!node.parentId || !leftCheckedKeys.includes(node.parentId)) {
                        node.parentId = parentId;
                        ancestorIds.push(node.id);
                    }
                }
            });
            setLeftNodes(TreeUtil.arrayToTree(treeNodes));
            setRightNodes(() => {
                const rightNodes = TreeUtil.arrayToTree(treeNodes);
                TreeUtil.traverseTree(rightNodes, node => {
                    node.disableCheckbox = leftCheckedKeys.includes(node.key);
                });
                return rightNodes;
            });
            props.onAdjust(ancestorIds, parentId);
        }
    }, [props, setLeftNodes, leftCheckedKeys, rightCheckedKeys]);

    const cancel = useCallback(() => {
        setLeftCheckedKeys([]);
        setRightCheckedKeys([]);
        setCheckStrictly(false);
        setLeftNodes(TreeUtil.arrayToTree(props.treeNodes));
        setRightNodes(TreeUtil.arrayToTree(props.treeNodes));
    }, [props, setLeftCheckedKeys, setRightCheckedKeys, setCheckStrictly, setLeftNodes, setRightNodes]);

    return (
        <div className={`${fta_class}`}>
            <Space direction={"horizontal"} size="middle" style={{display: "flex"}}>
                <Card title={"LeftTree"}>
                    <Tree
                        checkable
                        showLine={true}
                        treeData={leftNodes}
                        onCheck={onLeftCheck}
                        defaultExpandAll={true}
                        checkStrictly={checkStrictly}
                        checkedKeys={leftCheckedKeys}
                    />
                </Card>
                <Space direction={"vertical"} size={"middle"} align={"center"}>
                    <Button icon={<ArrowRightOutlined/>} onClick={change}/>
                    <Button icon={<CloseOutlined/>} onClick={cancel}/>
                </Space>
                <Card title={"RightTree"}>
                    <Tree
                        checkable
                        showLine={true}
                        checkStrictly={true}
                        onCheck={onRightCheck}
                        defaultExpandAll={true}
                        treeData={rightNodes}
                        checkedKeys={rightCheckedKeys}
                    />
                </Card>
            </Space>
        </div>
    )
}