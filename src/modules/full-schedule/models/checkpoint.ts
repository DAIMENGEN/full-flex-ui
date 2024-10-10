import React from "react";
import dayjs from "dayjs";
import {TimeStatus} from "./time";
import {ResourceApi} from "./resource";
import {PublicScheduleApi} from "./schedule";
import {Option} from "../../../common/models/option";
import {Dictionary, MenuArg, MenuItems, MountArg} from "../../../common/models/common";

export type CheckpointArg = {
    scheduleApi: PublicScheduleApi;
    checkpointApi: PublicCheckpointApi;
}

export type CheckpointContextMenuItems = MenuItems;

export type CheckpointMountArg = MountArg<CheckpointArg & TimeStatus>;

export type CheckpointContextMenuArg = MenuArg<CheckpointArg & TimeStatus>;

export type CheckpointMoveMountArg = MountArg<CheckpointArg & { date: dayjs.Dayjs }>;

export type Checkpoint = {
    id: string;
    title: string;
    timestamp: dayjs.Dayjs;
    resourceId: string;
    color?: string;
    tooltip?: React.ReactNode;
    extendedProps?: Dictionary;
}

export class CheckpointApi {
    private checkpoint: Checkpoint;
    private resourceApi?: ResourceApi;

    constructor(checkpoint: Checkpoint) {
        this.checkpoint = checkpoint;
    }

    setId(id: string): void {
        this.checkpoint.id = id;
    }

    getId(): string {
        return this.checkpoint.id;
    }

    setTitle(title: string): void {
        this.checkpoint.title = title;
    }

    getTitle(): string {
        return this.checkpoint.title;
    }

    setTimestamp(timestamp: dayjs.Dayjs): void {
        this.checkpoint.timestamp = timestamp;
    }

    getTimestamp(): dayjs.Dayjs {
        return this.checkpoint.timestamp;
    }

    setResourceId(resourceId: string): void {
        this.checkpoint.resourceId = resourceId;
    }

    getResourceId(): string {
        return this.checkpoint.resourceId;
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

    setColor(color: string): void {
        this.checkpoint.color = color;
    }

    getColor(): Option<string> {
        return Option.fromNullable(this.checkpoint.color);
    }

    setTooltip(tooltip: React.ReactNode): void {
        this.checkpoint.tooltip = tooltip;
    }

    getTooltip(): React.ReactNode {
        return this.checkpoint.tooltip;
    }

    setExtendedProps(extendedProps: Dictionary): void {
        this.checkpoint.extendedProps = extendedProps;
    }

    getExtendProps(): Option<Dictionary> {
        return Option.fromNullable(this.checkpoint.extendedProps);
    }
}

export type PublicCheckpointApi = Pick<CheckpointApi, PublicCheckpointApiMethods>;

export type PublicCheckpointApiMethods =
    "getId" |
    "getTitle" |
    "getTimestamp" |
    "getResourceId" |
    "getResourceApi" |
    "getColor" |
    "getTooltip" |
    "getExtendProps";