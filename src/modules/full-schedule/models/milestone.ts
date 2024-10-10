import React from "react";
import dayjs from "dayjs";
import {TimeStatus} from "./time";
import {ResourceApi} from "./resource";
import {PublicScheduleApi} from "./schedule";
import {Option} from "../../../common/models/option";
import {Dictionary, MenuArg, MenuItems, MountArg} from "../../../common/models/common";

export type MilestoneArg = {
    scheduleApi: PublicScheduleApi;
    milestoneApi: PublicMilestoneApi;
}

export type MilestoneContextMenuItems = MenuItems;

export type MilestoneMountArg = MountArg<MilestoneArg & TimeStatus>;

export type MilestoneContextMenuArg = MenuArg<MilestoneArg & TimeStatus>;

export type MilestoneMoveMountArg = MountArg<MilestoneArg & { date: dayjs.Dayjs }>;

export type MilestoneStatus = "Success" | "Failure" | "Warning";

export type Milestone = {
    id: string;
    title: string;
    timestamp: dayjs.Dayjs;
    status: MilestoneStatus;
    resourceId: string;
    color?: string;
    tooltip?: React.ReactNode;
    extendedProps?: Dictionary;
}

export class MilestoneApi {
    private milestone: Milestone;
    private resourceApi?: ResourceApi;

    constructor(milestone: Milestone) {
        this.milestone = milestone;
    }

    setId(id: string): void {
        this.milestone.id = id;
    }

    getId(): string {
        return this.milestone.id;
    }

    setTitle(title: string): void {
        this.milestone.title = title;
    }

    getTitle(): string {
        return this.milestone.title;
    }

    setTimestamp(timestamp: dayjs.Dayjs): void {
        this.milestone.timestamp = timestamp;
    }

    getTimestamp(): dayjs.Dayjs {
        return this.milestone.timestamp;
    }

    setStatus(status: MilestoneStatus): void {
        this.milestone.status = status;
    }

    getStatus(): MilestoneStatus {
        return this.milestone.status;
    }

    setResourceApi(resourceApi: ResourceApi): void {
        this.resourceApi = resourceApi;
    }

    getResourceApi(): ResourceApi {
        if (!this.resourceApi) {
            throw new Error("resourceApi is not available. Please make sure to initialize it before accessing.");
        }
        return this.resourceApi;
    }

    setResourceId(resourceId: string): void {
        this.milestone.resourceId = resourceId;
    }

    getResourceId(): string {
        return this.milestone.resourceId;
    }

    setColor(color: string): void {
        this.milestone.color = color;
    }

    getColor(): Option<string> {
        return Option.fromNullable(this.milestone.color);
    }

    setTooltip(tooltip: React.ReactNode): void {
        this.milestone.tooltip = tooltip;
    }

    getTooltip(): React.ReactNode {
        return this.milestone.tooltip;
    }

    setExtendedProps(extendedProps: Dictionary): void {
        this.milestone.extendedProps = extendedProps;
    }

    getExtendProps(): Option<Dictionary> {
        return Option.fromNullable(this.milestone.extendedProps);
    }
}

export type PublicMilestoneApi = Pick<MilestoneApi, PublicMilestoneApiMethods>;

export type PublicMilestoneApiMethods =
    "getId" |
    "getTitle" |
    "getTimestamp" |
    "getStatus" |
    "getResourceApi" |
    "getResourceId" |
    "getColor" |
    "getTooltip" |
    "getExtendProps";