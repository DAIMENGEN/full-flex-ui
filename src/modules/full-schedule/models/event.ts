import React from "react";
import dayjs from "dayjs";
import {TimeStatus} from "./time";
import {PublicScheduleApi} from "./schedule";
import {Option} from "../../../common/models/option";
import {ResourceApi} from "./resource";
import {Dictionary, MenuArg, MenuItems, MountArg} from "../../../common/models/common";

export type EventArg = {
    scheduleApi: PublicScheduleApi,
    eventApi: PublicEventApi;
}

export type EventContextMenuItems = MenuItems;

export type EventMountArg = MountArg<EventArg & TimeStatus>;

export type EventContextMenuArg = MenuArg<EventArg & TimeStatus>;

export type EventResizeMountArg = MountArg<EventArg & { date: dayjs.Dayjs }>;

export type EventMoveMountArg = MountArg<EventArg & { startDate: dayjs.Dayjs, endDate: dayjs.Dayjs}>;

export type Event = {
    id: string;
    title: string;
    color: string;
    start: dayjs.Dayjs;
    end?: dayjs.Dayjs;
    resourceId: string;
    url?: string;
    tooltip?: React.ReactNode;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    extendedProps?: Dictionary;
}

export class EventApi {
    private event: Event;
    private resourceApi?: ResourceApi;

    constructor(event: Event) {
        this.event = event;
    }

    setId(id: string): void {
        this.event.id = id;
    }

    getId(): string {
        return this.event.id;
    }

    setTitle(title: string): void {
        this.event.title = title;
    }

    getTitle(): string {
        return this.event.title;
    }

    setColor(color: string): void {
        this.event.color = color;
    }

    getColor(): string {
        return this.event.color;
    }

    setStart(start: dayjs.Dayjs): void {
        this.event.start = start;
    }

    getStart(): dayjs.Dayjs {
        return this.event.start;
    }

    setEnd(end: dayjs.Dayjs): void {
        this.event.end = end;
    }

    getEnd(): Option<dayjs.Dayjs> {
        return Option.fromNullable(this.event.end);
    }

    setResourceId(resourceId: string): void {
        this.event.resourceId = resourceId;
    }

    getResourceId(): string {
        return this.event.resourceId;
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

    setUrl(url: string): void {
        this.event.url = url;
    }

    getUrl(): Option<string> {
        return Option.fromNullable(this.event.url);
    }

    setTooltip(tooltip: React.ReactNode): void {
        this.event.tooltip = tooltip;
    }

    getTooltip(): React.ReactNode {
        return this.event.tooltip;
    }

    setTextColor(textColor: string): void {
        this.event.textColor = textColor;
    }

    getTextColor(): Option<string> {
        return Option.fromNullable(this.event.textColor);
    }

    setBorderColor(borderColor: string): void {
        this.event.borderColor = borderColor;
    }

    getBorderColor(): Option<string> {
        return Option.fromNullable(this.event.borderColor);
    }

    setBackgroundColor(backgroundColor: string): void {
        this.event.backgroundColor = backgroundColor;
    }

    getBackgroundColor(): Option<string> {
        return Option.fromNullable(this.event.backgroundColor);
    }

    setExtendedProps(extendedProps: Dictionary): void {
        this.event.extendedProps = extendedProps;
    }

    getExtendProps(): Option<Dictionary> {
        return Option.fromNullable(this.event.extendedProps);
    }
}

export type PublicEventApi = Pick<EventApi, PublicEventApiMethods>;

export type PublicEventApiMethods =
    "getId" |
    "getTitle" |
    "getColor" |
    "getStart" |
    "getEnd" |
    "getResourceId" |
    "getResourceApi" |
    "getUrl" |
    "getTooltip" |
    "getTextColor" |
    "getBorderColor" |
    "getBackgroundColor" |
    "getExtendProps";