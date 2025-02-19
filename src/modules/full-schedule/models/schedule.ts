import {
    Event,
    EventApi,
    EventContextMenuArg,
    EventContextMenuItems,
    EventMountArg,
    EventMoveMountArg,
    EventResizeMountArg,
    PublicEventApi
} from "./event";
import {
    ContextMenuClickHandler,
    DidMountHandler,
    MountArg,
    MoveHandler,
    ResizeHandler,
    SelectHandler,
    WillUnmountHandler
} from "../../../common/models/common";
import {
    Milestone,
    MilestoneApi,
    MilestoneContextMenuArg,
    MilestoneContextMenuItems,
    MilestoneMountArg,
    MilestoneMoveMountArg,
    PublicMilestoneApi
} from "./milestone";
import {
    Checkpoint,
    CheckpointApi,
    CheckpointContextMenuArg,
    CheckpointContextMenuItems,
    CheckpointMountArg,
    CheckpointMoveMountArg,
    PublicCheckpointApi
} from "./checkpoint";
import {
    PublicResourceApi,
    Resource,
    ResourceApi,
    ResourceApiHelper,
    ResourceAreaColumn,
    ResourceContextMenuItems,
    ResourceLabelContextMenuArg,
    ResourceLabelMountArg,
    ResourceLaneContextMenuArg,
    ResourceLaneMountArg,
    ResourceUtils
} from "./resource";
import dayjs from "dayjs";
import {ScheduleView, ScheduleViewType} from "./schedule-view";
import {Option} from "../../../common/models/option";
import {TimelineApi, TimelineSlotLabelMountArg, TimelineSlotLaneMountArg} from "./timeline/timeline";
import {MutableRefObject} from "react";
import {SelectInfoArg} from "./misc";

export type ScheduleProps = {
    end: dayjs.Dayjs;
    start: dayjs.Dayjs;
    editable: boolean;
    selectable: boolean;
    lineHeight: number;
    slotMinWidth: number;
    scheduleMaxHeight: number;
    scheduleViewType: ScheduleViewType;
    events: Array<Event>;
    resources: Array<Resource>;
    milestones?: Array<Milestone>;
    checkpoints?: Array<Checkpoint>;
    companyHolidays?: Array<dayjs.Dayjs>;
    specialWorkdays?: Array<dayjs.Dayjs>;
    nationalHolidays?: Array<dayjs.Dayjs>;
    defaultEmptyLanes?: number;
    resourceAreaWidth?: string;
    resourceAreaColumns?: Array<ResourceAreaColumn>;
    // event.
    selectAllow?: SelectHandler<SelectInfoArg>;
    enableEventContextMenu?: boolean;
    eventContextMenuClick?: ContextMenuClickHandler<EventContextMenuArg>;
    eventContextMenuItems?: EventContextMenuItems;
    eventDidMount?: DidMountHandler<EventMountArg>;
    eventWillUnmount?: WillUnmountHandler<EventMountArg>;
    eventMove?: MoveHandler<EventMoveMountArg>;
    eventResizeStart?: ResizeHandler<EventResizeMountArg>;
    eventResizeEnd?: ResizeHandler<EventResizeMountArg>;
    // milestone.
    enableMilestoneContextMenu?: boolean;
    milestoneContextMenuClick?: ContextMenuClickHandler<MilestoneContextMenuArg>;
    milestoneContextMenuItems?: MilestoneContextMenuItems;
    milestoneDidMount?: DidMountHandler<MilestoneMountArg>;
    milestoneWillUnmount?: WillUnmountHandler<MilestoneMountArg>;
    milestoneMove?: MoveHandler<MilestoneMoveMountArg>;
    // checkpoint.
    enableCheckpointContextMenu?: boolean;
    checkpointContextMenuClick?: ContextMenuClickHandler<CheckpointContextMenuArg>;
    checkpointContextMenuItems?: CheckpointContextMenuItems;
    checkpointDidMount?: DidMountHandler<CheckpointMountArg>;
    checkpointWillUnmount?: WillUnmountHandler<CheckpointMountArg>;
    checkpointMove?: MoveHandler<CheckpointMoveMountArg>;
    // resource.
    enableResourceLaneContextMenu?: boolean;
    resourceLaneContextMenuClick?: ContextMenuClickHandler<ResourceLaneContextMenuArg>;
    resourceLaneContextMenuItems?: ResourceContextMenuItems;
    resourceLaneDidMount?: DidMountHandler<ResourceLaneMountArg>;
    resourceLaneWillUnmount?: WillUnmountHandler<ResourceLaneMountArg>;
    // resource.
    enableResourceLabelContextMenu?: boolean;
    resourceLabelContextMenuClick?: ContextMenuClickHandler<ResourceLabelContextMenuArg>;
    resourceLabelContextMenuItems?: ResourceContextMenuItems;
    resourceLabelDidMount?: DidMountHandler<ResourceLabelMountArg>;
    resourceLabelWillUnmount?: WillUnmountHandler<ResourceLabelMountArg>;
    // timeline.
    timelineSlotLabelDidMount?: DidMountHandler<TimelineSlotLabelMountArg>;
    timelineSlotLabelWillUnmount?: WillUnmountHandler<TimelineSlotLabelMountArg>;
    timelineSlotLaneDidMount?: DidMountHandler<TimelineSlotLaneMountArg>;
    timelineSlotLaneWillUnmount?: WillUnmountHandler<TimelineSlotLaneMountArg>;
    // schedule.
    scheduleDidMount?: DidMountHandler<ScheduleMountArg>;
    scheduleWillUnmount?: DidMountHandler<ScheduleMountArg>;
}

export type ScheduleMountArg = MountArg<{ scheduleApi: PublicScheduleApi }>;

export class ScheduleApi implements PublicScheduleApi {
    private readonly scheduleProps: ScheduleProps;
    private readonly scheduleView: ScheduleView;
    private readonly timelineApi: TimelineApi;
    private readonly eventApis: Array<EventApi>;
    private readonly resourceApis: Array<ResourceApi>;
    private readonly flatMapResourceApis: Array<ResourceApi>;
    private readonly milestoneApis: Array<MilestoneApi>;
    private readonly checkpointApis: Array<CheckpointApi>;

    private generateTimelineApi(props: ScheduleProps): TimelineApi {
        let timelineApi: TimelineApi;
        switch (props.scheduleViewType) {
            case "Week":
                const startWeekDate = props.start.startOf("week");
                const endWeekDate = props.end.endOf("week");
                timelineApi = new TimelineApi(startWeekDate, endWeekDate);
                break;
            case "Month":
                const startMonthDate = props.start.startOf("month");
                const endMonthDate = props.end.endOf("month");
                timelineApi = new TimelineApi(startMonthDate, endMonthDate);
                break;
            case "Quarter":
                const startQuarterDate = props.start.startOf("quarter");
                const endQuarterDate = props.end.endOf("quarter");
                timelineApi = new TimelineApi(startQuarterDate, endQuarterDate);
                break;
            case "Year":
                const startYearDate = props.start.startOf("year");
                const endYearDate = props.end.endOf("year");
                timelineApi = new TimelineApi(startYearDate, endYearDate);
                break;
            case "Day":
            default:
                timelineApi = new TimelineApi(props.start, props.end);
                break;
        }
        timelineApi.setSpecialWorkdays(props.specialWorkdays || []);
        timelineApi.setCompanyHolidays(props.companyHolidays || []);
        timelineApi.setNationalHolidays(props.nationalHolidays || []);
        return timelineApi;
    }

    constructor(scheduleView: ScheduleView, props: ScheduleProps) {
        this.eventApis = props.events.map(e => new EventApi(e));
        this.milestoneApis = props.milestones?.map(m => new MilestoneApi(m)) || [];
        this.checkpointApis = props.checkpoints?.map(c => new CheckpointApi(c)) || [];
        this.scheduleProps = props;
        this.scheduleView = scheduleView;
        this.timelineApi = this.generateTimelineApi(props);
        this.resourceApis = ResourceApiHelper.createTree([...props.resources, ...ResourceUtils.createEmptyResources(props.defaultEmptyLanes || 0)], this.eventApis, this.milestoneApis, this.checkpointApis);
        this.flatMapResourceApis = ResourceApiHelper.flatMapTree(this.resourceApis);
    }

    getProps(): ScheduleProps {
        return this.scheduleProps;
    }

    getStart(): dayjs.Dayjs {
        return this.scheduleProps.start;
    }

    getEnd(): dayjs.Dayjs {
        return this.scheduleProps.end;
    }

    getLineHeight(): number {
        return this.scheduleProps.lineHeight;
    }

    getSlotMinWidth(): number {
        return this.scheduleProps.slotMinWidth;
    }

    getScheduleMaxHeight(): number {
        return this.scheduleProps.scheduleMaxHeight;
    }

    getScheduleView(): ScheduleView {
        return this.scheduleView;
    }

    getScheduleViewType(): ScheduleViewType {
        return this.scheduleProps.scheduleViewType;
    }

    getResourceAreaColumns(): ResourceAreaColumn[] {
        const resourceAreaColumns = this.scheduleProps.resourceAreaColumns;
        return resourceAreaColumns || [{
            field: "title",
            headerContent: "Resource"
        }];
    }

    getTimelineApi(): TimelineApi {
        return this.timelineApi;
    }

    getEventApis(): Array<EventApi> {
        return this.eventApis;
    }

    getEventApiById(eventId: string): Option<EventApi> {
        return Option.fromNullable(this.eventApis.find(e => e.getId() === eventId));
    }

    getResourceApis(): Array<ResourceApi> {
        return this.resourceApis;
    }

    getResourceApiById(resourceId: string): Option<ResourceApi> {
        return Option.fromNullable(this.resourceApis.find(r => r.getId() === resourceId));
    }

    getFlatMapResourceApis(): Array<ResourceApi> {
        return this.flatMapResourceApis;
    }

    isEditable(): boolean {
        const viewType = this.scheduleProps.scheduleViewType;
        return this.scheduleProps.editable && viewType == "Day";
    }

    isSelectable(): boolean {
        return this.scheduleProps.selectable;
    }

    getMilestoneApis(): Array<MilestoneApi> {
        return this.milestoneApis;
    }

    getMilestoneApiById(milestoneId: string): Option<MilestoneApi> {
        return Option.fromNullable(this.milestoneApis.find(m => m.getId() === milestoneId));
    }

    getCheckpointApis(): Array<CheckpointApi> {
        return this.checkpointApis;
    }

    getCheckpointApiById(checkpointId: string): Option<CheckpointApi> {
        return Option.fromNullable(this.checkpointApis.find(c => c.getId() === checkpointId));
    }

    getScheduleElRef(): MutableRefObject<HTMLDivElement | null> {
        return this.scheduleView.getScheduleElRef();
    }

    eventDidMount(arg: EventMountArg): void {
        const eventDidMount = this.scheduleProps.eventDidMount;
        eventDidMount && eventDidMount(arg);
    }

    eventWillUnmount(arg: EventMountArg): void {
        const eventWillUnmount = this.scheduleProps.eventWillUnmount;
        eventWillUnmount && eventWillUnmount(arg);
    }

    eventMove(arg: EventMoveMountArg): void {
        const eventMove = this.scheduleProps.eventMove;
        eventMove && eventMove(arg);
    }

    eventResizeStart(arg: EventResizeMountArg): void {
        const eventResizeStart = this.scheduleProps.eventResizeStart;
        eventResizeStart && eventResizeStart(arg);
    }

    eventResizeEnd(arg: EventResizeMountArg): void {
        const eventResizeEnd = this.scheduleProps.eventResizeEnd;
        eventResizeEnd && eventResizeEnd(arg);
    }

    selectAllow(arg: SelectInfoArg): void {
        const selectAllow = this.scheduleProps.selectAllow;
        selectAllow && selectAllow(arg);
    }

    isEnableEventContextMenu() {
        const isEnable = this.scheduleProps.enableEventContextMenu;
        return isEnable as boolean;
    }

    getEventContextMenuItems() {
        return this.scheduleProps.eventContextMenuItems;
    }

    onEventContextMenuClick(arg: EventContextMenuArg) {
        const eventContextMenuClick = this.scheduleProps.eventContextMenuClick;
        eventContextMenuClick && eventContextMenuClick(arg);
    }

    resourceLaneDidMount(arg: ResourceLaneMountArg): void {
        const resourceLaneDidMount = this.scheduleProps.resourceLaneDidMount;
        resourceLaneDidMount && resourceLaneDidMount(arg);
    }

    resourceLaneWillUnmount(arg: ResourceLaneMountArg): void {
        const resourceLaneWillUnmount = this.scheduleProps.resourceLaneWillUnmount;
        resourceLaneWillUnmount && resourceLaneWillUnmount(arg);
    }

    isEnableResourceLaneContextMenu() {
        const isEnable = this.scheduleProps.enableResourceLaneContextMenu;
        return isEnable as boolean;
    }

    getResourceLaneContextMenuItems() {
        return this.scheduleProps.resourceLaneContextMenuItems;
    }

    onResourceLaneContextMenuClick(arg: ResourceLaneContextMenuArg) {
        const resourceContextMenuClick = this.scheduleProps.resourceLaneContextMenuClick;
        resourceContextMenuClick && resourceContextMenuClick(arg);
    }

    resourceLabelDidMount(arg: ResourceLabelMountArg): void {
        const resourceLabelDidMount = this.scheduleProps.resourceLabelDidMount;
        resourceLabelDidMount && resourceLabelDidMount(arg);
    }

    resourceLabelWillUnmount(arg: ResourceLabelMountArg): void {
        const resourceLabelWillUnmount = this.scheduleProps.resourceLabelWillUnmount;
        resourceLabelWillUnmount && resourceLabelWillUnmount(arg);
    }

    isEnableResourceLabelContextMenu() {
        const isEnable = this.scheduleProps.enableResourceLabelContextMenu;
        return isEnable as boolean;
    }

    getResourceLabelContextMenuItems() {
        return this.scheduleProps.resourceLabelContextMenuItems;
    }

    onResourceLabelContextMenuClick(arg: ResourceLabelContextMenuArg) {
        const resourceLabelContextMenuClick = this.scheduleProps.resourceLabelContextMenuClick;
        resourceLabelContextMenuClick && resourceLabelContextMenuClick(arg);
    }

    milestoneDidMount(arg: MilestoneMountArg): void {
        const milestoneDidMount = this.scheduleProps.milestoneDidMount;
        milestoneDidMount && milestoneDidMount(arg);
    }

    milestoneWillUnmount(arg: MilestoneMountArg): void {
        const milestoneWillUnmount = this.scheduleProps.milestoneWillUnmount;
        milestoneWillUnmount && milestoneWillUnmount(arg);
    }

    isEnableMilestoneContextMenu() {
        const isEnable = this.scheduleProps.enableMilestoneContextMenu;
        return isEnable as boolean;
    }

    getMilestoneContextMenuItems() {
        return this.scheduleProps.milestoneContextMenuItems;
    }

    onMilestoneContextMenuClick(arg: MilestoneContextMenuArg) {
        const milestoneContextMenuClick = this.scheduleProps.milestoneContextMenuClick;
        milestoneContextMenuClick && milestoneContextMenuClick(arg);
    }

    milestoneMove(arg: MilestoneMoveMountArg) {
        const milestoneMove = this.scheduleProps.milestoneMove;
        milestoneMove && milestoneMove(arg);
    }

    checkpointDidMount(arg: CheckpointMountArg): void {
        const checkpointDidMount = this.scheduleProps.checkpointDidMount;
        checkpointDidMount && checkpointDidMount(arg);
    }

    checkpointWillUnmount(arg: CheckpointMountArg): void {
        const checkpointWillUnmount = this.scheduleProps.checkpointWillUnmount;
        checkpointWillUnmount && checkpointWillUnmount(arg);
    }

    isEnableCheckpointContextMenu() {
        const isEnable = this.scheduleProps.enableCheckpointContextMenu;
        return isEnable as boolean;
    }

    getCheckpointContextMenuItems() {
        return this.scheduleProps.checkpointContextMenuItems;
    }

    onCheckpointContextMenuClick(arg: CheckpointContextMenuArg) {
        const checkpointContextMenuClick = this.scheduleProps.checkpointContextMenuClick;
        checkpointContextMenuClick && checkpointContextMenuClick(arg);
    }

    checkpointMove(arg: CheckpointMoveMountArg) {
        const checkpointMove = this.scheduleProps.checkpointMove;
        checkpointMove && checkpointMove(arg);
    }

    timelineSlotLaneDidMount(arg: TimelineSlotLaneMountArg): void {
        const timelineSlotLaneDidMount = this.scheduleProps.timelineSlotLaneDidMount;
        timelineSlotLaneDidMount && timelineSlotLaneDidMount(arg);
    }

    timelineSlotLaneWillUnmount(arg: TimelineSlotLaneMountArg): void {
        const timelineSlotLaneWillUnmount = this.scheduleProps.timelineSlotLaneWillUnmount;
        timelineSlotLaneWillUnmount && timelineSlotLaneWillUnmount(arg);
    }

    timelineSlotLabelDidMount(arg: TimelineSlotLabelMountArg): void {
        const timelineSlotLabelDidMount = this.scheduleProps.timelineSlotLabelDidMount;
        timelineSlotLabelDidMount && timelineSlotLabelDidMount(arg);
    }

    timelineSlotLabelWillUnmount(arg: TimelineSlotLabelMountArg): void {
        const timelineSlotLabelWillUnmount = this.scheduleProps.timelineSlotLabelWillUnmount;
        timelineSlotLabelWillUnmount && timelineSlotLabelWillUnmount(arg);
    }

    scheduleDidMount(arg: ScheduleMountArg): void {
        const scheduleDidMount = this.scheduleProps.scheduleDidMount;
        scheduleDidMount && scheduleDidMount(arg);
    }

    scheduleWillUnmount(arg: ScheduleMountArg): void {
        const scheduleWillUnmount = this.scheduleProps.scheduleWillUnmount;
        scheduleWillUnmount && scheduleWillUnmount(arg);
    }
}

export interface PublicScheduleApi {
    getProps(): ScheduleProps;

    getStart(): dayjs.Dayjs;

    getEnd(): dayjs.Dayjs;

    getLineHeight(): number;

    getSlotMinWidth(): number;

    getScheduleMaxHeight(): number;

    getScheduleViewType(): ScheduleViewType;

    getResourceAreaColumns(): ResourceAreaColumn[];

    getEventApis(): Array<PublicEventApi>;

    getEventApiById(eventId: string): Option<PublicEventApi>;

    getResourceApis(): Array<PublicResourceApi>;

    getResourceApiById(resourceId: string): Option<PublicResourceApi>;

    getFlatMapResourceApis(): Array<PublicResourceApi>;

    isEditable(): boolean;

    isSelectable(): boolean;

    getMilestoneApis(): Array<PublicMilestoneApi>;

    getMilestoneApiById(milestoneId: string): Option<PublicMilestoneApi>;

    getCheckpointApis(): Array<PublicCheckpointApi>;

    getCheckpointApiById(checkpointId: string): Option<PublicCheckpointApi>;

    getScheduleElRef(): MutableRefObject<HTMLDivElement | null>;
}