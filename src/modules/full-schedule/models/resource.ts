import React from "react";
import {EventApi} from "./event";
import {PublicScheduleApi} from "./schedule";
import {MilestoneApi} from "./milestone";
import {CheckpointApi} from "./checkpoint";
import {Option} from "../../../common/models/option";
import {GroupUtil} from "../../../common/utils/group-util";
import {Dictionary, MenuArg, MenuItems, MountArg} from "../../../common/models/common";

export type ResourceLaneArg = {
    scheduleApi: PublicScheduleApi;
    resourceApi: PublicResourceApi;
    label: ResourceAreaColumn;
}

export interface ResourceLabelArg {
    label: ResourceAreaColumn;
}

export type ResourceContextMenuItems = MenuItems;

export type ResourceAreaColumn = { field: string; headerContent: string; }

export type ResourceLaneMountArg = MountArg<ResourceLaneArg>;

export type ResourceLabelMountArg = MountArg<ResourceLabelArg>;

export type ResourceLaneContextMenuArg = MenuArg<ResourceLaneArg>;

export type ResourceLabelContextMenuArg = MenuArg<ResourceLabelArg>;


export type Resource = {
    id: string;
    title: string;
    tooltip?: React.ReactNode;
    parentId?: string;
    eventColor?: string;
    eventTextColor?: string;
    eventBorderColor?: string;
    eventBackgroundColor?: string;
    extendedProps?: Dictionary;
}

export class ResourceApi {
    private depth: number;
    private readonly resource: Resource;
    private parent?: ResourceApi;
    private children: Array<ResourceApi>;
    private eventApis?: Array<EventApi>;
    private milestoneApis?: Array<MilestoneApi>;
    private checkpointApis?: Array<CheckpointApi>;

    constructor(resource: Resource) {
        this.depth = 0;
        this.resource = resource;
        this.children = new Array<ResourceApi>();
    }

    setId(id: string): void {
        this.resource.id = id;
    }

    getId(): string {
        return this.resource.id;
    }

    setTitle(title: string): void {
        this.resource.title = title;
    }

    getTitle(): string {
        return this.resource.title;
    }

    setDepth(depth: number): void {
        this.depth = depth;
    }

    getDepth(): number {
        return this.depth;
    }

    setTooltip(tooltip: React.ReactNode): void {
        this.resource.tooltip = tooltip;
    }

    getTooltip(): React.ReactNode {
        return this.resource.tooltip;
    }

    setParent(parent?: ResourceApi): void {
        this.parent = parent;
    }

    getParent(): Option<ResourceApi> {
        return Option.fromNullable(this.parent);
    }

    setParentId(parentId: string): void {
        this.resource.parentId = parentId;
    }

    getParentId(): Option<string> {
        return Option.fromNullable(this.resource.parentId);
    }

    setChildren(children: Array<ResourceApi>): void {
        this.children = children;
    }

    getChildren(): Array<ResourceApi> {
        return this.children;
    }

    setEventColor(color: string): void {
        this.resource.eventColor = color;
    }

    getEventColor(): Option<String> {
        return Option.fromNullable(this.resource.eventColor);
    }

    setEventTextColor(color: string): void {
        this.resource.eventTextColor = color;
    }

    getEventTextColor(): Option<String> {
        return Option.fromNullable(this.resource.eventTextColor);
    }

    setEventBorderColor(color: string): void {
        this.resource.eventBorderColor = color;
    }

    getEventBorderColor(): Option<String> {
        return Option.fromNullable(this.resource.eventBorderColor);
    }

    setEventBackgroundColor(color: string): void {
        this.resource.eventBackgroundColor = color;
    }

    getEventBackgroundColor(): Option<String> {
        return Option.fromNullable(this.resource.eventBackgroundColor);
    }

    getResource(): Resource {
        return this.resource;
    }

    setEventApis(eventApis: Array<EventApi>): void {
        this.eventApis = eventApis;
    }

    getEventApis(): Array<EventApi> {
        if (!this.eventApis) {
            throw new Error("eventApis is not available. Please make sure to initialize it before accessing.");
        }
        return this.eventApis;
    }

    setMilestoneApis(milestoneApis: Array<MilestoneApi>): void {
        this.milestoneApis = milestoneApis;
    }

    getMilestoneApis(): Array<MilestoneApi> {
        if (!this.milestoneApis) {
            throw new Error("milestoneApis is not available. Please make sure to initialize it before accessing.");
        }
        return this.milestoneApis;
    }

    setCheckpointApis(checkpointApis: Array<CheckpointApi>): void {
        this.checkpointApis = checkpointApis;
    }

    getCheckpointApis(): Array<CheckpointApi> {
        if (!this.checkpointApis) {
            throw new Error("checkpointApis is not available. Please make sure to initialize it before accessing.");
        }
        return this.checkpointApis;
    }

    setExtendedProps(extendedProps: Dictionary): void {
        this.resource.extendedProps = extendedProps;
    }

    getExtendProps(): Option<Dictionary> {
        return Option.fromNullable(this.resource.extendedProps);
    }
}

export class ResourceApiHelper {

    static compare(prev: ResourceApi, next: ResourceApi): number {
        const prevOrder = prev.getExtendProps().getOrElse({order: 0}).order;
        const nextOrder = next.getExtendProps().getOrElse({order: 0}).order;
        return prevOrder - nextOrder;
    }

    static createTree(resources: Array<Resource>, eventApis: Array<EventApi>, milestoneApis: Array<MilestoneApi>, checkpointApis: Array<CheckpointApi>): Array<ResourceApi> {
        const rootId = "undefined";
        const resourceApis = resources.map(resource => new ResourceApi(resource));
        const eventApisMap = new Map(Object.entries(GroupUtil.groupArray(eventApis, eventApi => eventApi.getResourceId())));
        const resourcesApiMap = resourceApis.reduce((map, obj) => map.set(obj.getId(), obj), new Map<string, ResourceApi>());
        const milestoneApisMap = new Map(Object.entries(GroupUtil.groupArray(milestoneApis, milestoneApi => milestoneApi.getResourceId())));
        const checkpointApisMap = new Map(Object.entries(GroupUtil.groupArray(checkpointApis, checkpointApi => checkpointApi.getResourceId())));
        const stack = [{parentId: rootId, depth: 0}];
        const parentApiMap = new Map(Object.entries(GroupUtil.groupArray(resourceApis, resourceApi => resourceApi.getParentId().getOrElse(rootId))));
        while (stack.length > 0) {
            const current = stack.pop();
            if (current) {
                const {parentId, depth} = current;
                const children = parentApiMap.get(parentId);
                if (children) {
                    children.sort(ResourceApiHelper.compare).forEach(child => {
                        const resourceId = child.getId();
                        child.setDepth(depth);
                        child.setParent(resourcesApiMap.get(parentId));
                        child.setChildren(parentApiMap.get(resourceId) || []);
                        const targetEventApis = eventApisMap.get(resourceId) || [];
                        targetEventApis.forEach(e => e.setResourceApi(child));
                        child.setEventApis(targetEventApis);
                        const targetMilestoneApis = milestoneApisMap.get(resourceId) || [];
                        targetMilestoneApis.forEach(m => m.setResourceApi(child));
                        child.setMilestoneApis(targetMilestoneApis);
                        const targetCheckpointApis = checkpointApisMap.get(resourceId) || [];
                        targetCheckpointApis.forEach(c => c.setResourceApi(child));
                        child.setCheckpointApis(targetCheckpointApis);
                        stack.push({parentId: resourceId, depth: depth + 1});
                    });
                }
            }
        }
        return parentApiMap.get(rootId) || [];
    }

    static flatMapTree(resourceApis: Array<ResourceApi>): Array<ResourceApi> {
        const result: Array<ResourceApi> = [];
        const stack: Array<ResourceApi> = [...resourceApis];
        while (stack.length > 0) {
            const current = stack.pop();
            if (current) {
                result.push(current);
                for (let i = current.getChildren().length - 1; i >= 0; i--) {
                    stack.push(current.getChildren()[i]);
                }
            }
        }
        return result;
    }
}

export type PublicResourceApi = Pick<ResourceApi, PublicResourceApiMethods>;

export type PublicResourceApiMethods =
    "getId" |
    "getTitle" |
    "getDepth" |
    "getTooltip" |
    "getParent" |
    "getParentId" |
    "getChildren" |
    "getEventColor" |
    "getEventTextColor" |
    "getEventBorderColor" |
    "getEventBackgroundColor" |
    "getResource" |
    "getEventApis" |
    "getMilestoneApis" |
    "getCheckpointApis" |
    "getExtendProps";
