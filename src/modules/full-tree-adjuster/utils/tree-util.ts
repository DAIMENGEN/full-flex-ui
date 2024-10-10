import {TreeNode} from "../models";
import {TreeDataNode} from "antd";

export class TreeUtil {

    static arrayToTree(nodes: Array<TreeNode>): Array<TreeDataNode> {
        nodes.sort((prev, next) => (prev.order || 0 )- (next.order || 0));
        const map: Record<string, TreeDataNode> = {};
        const treeDataNodes: Array<TreeDataNode> = [];

        // Step 1: Create a map of all nodes
        nodes.forEach(node => {
            map[node.id] = {
                key: node.id,
                title: node.title,
                children: [],
                disableCheckbox: false,
            }
        });

        // Step 2: Build the tree structure
        nodes.forEach(node => {
            const treeDataNode: TreeDataNode = map[node.id];
            if (node.parentId) {
                // If there is a parent, add this node to the parent's children
                const parentNode: TreeDataNode = map[node.parentId];
                if (parentNode) {
                    parentNode.children?.push(treeDataNode);
                }
            } else {
                // If no parentKey, it's a root node
                treeDataNodes.push(treeDataNode);
            }
        });

        return treeDataNodes;
    }

    static traverseTree(nodes: TreeDataNode[], callback: (node: TreeDataNode) => void) {
        const stack: Array<TreeDataNode> = [...nodes];
        while (stack.length > 0) {
            const node = stack.pop()!;
            callback(node);
            if (node.children && node.children.length > 0) {
                stack.push(...node.children);
            }
        }
    }
}