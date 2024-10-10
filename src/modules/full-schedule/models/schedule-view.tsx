import React, {MutableRefObject} from "react";
import {ScheduleApi, ScheduleProps} from "./schedule";
import {
    FullScheduleResourceTableColgroup
} from "../components/gantt-chart/segments/table-colgroup/full-schedule-resource-table-colgroup";
import {fs_class, row} from "../constants";
import {
    FullScheduleResourceLabelCell
} from "../components/gantt-chart/segments/datagrid-cell/full-schedule-resource-label-cell";
import {ResourceApi} from "./resource";
import {
    FullScheduleResourceLaneCell
} from "../components/gantt-chart/segments/datagrid-cell/full-schedule-resource-lane-cell";
import {TimelineView} from "./timeline/views/timeline-view";
import {DayTimelineView} from "./timeline/views/day-timeline-view";
import {WeekTimelineView} from "./timeline/views/week-timeline-view";
import {MonthTimelineView} from "./timeline/views/month-timeline-view";
import {QuarterTimelineView} from "./timeline/views/quarter-timeline-view";
import {YearTimelineView} from "./timeline/views/year-timeline-view";

export type ScheduleViewType = "Day" | "Week" | "Month" | "Quarter" | "Year";

export class ScheduleView {

    private readonly scheduleApi: ScheduleApi;

    private readonly timelineView: TimelineView;

    private readonly scheduleElRef: MutableRefObject<HTMLDivElement | null>;

    constructor(props: ScheduleProps, scheduleElRef: MutableRefObject<HTMLDivElement | null>) {
        this.scheduleElRef = scheduleElRef;
        this.scheduleApi = new ScheduleApi(this, props);
        const scheduleViewType = this.scheduleApi.getScheduleViewType();
        switch (scheduleViewType) {
            case "Day":
                this.timelineView = new DayTimelineView(this.scheduleApi);
                break;
            case "Week":
                this.timelineView = new WeekTimelineView(this.scheduleApi);
                break;
            case "Month":
                this.timelineView = new MonthTimelineView(this.scheduleApi);
                break;
            case "Quarter":
                this.timelineView = new QuarterTimelineView(this.scheduleApi);
                break;
            case "Year":
                this.timelineView = new YearTimelineView(this.scheduleApi);
                break;
        }
    }

    renderTimelineTableColgroup(): React.ReactNode {
        return this.timelineView.renderColgroup();
    }

    renderTimelineBodyTableSlots(): React.ReactNode {
        return this.timelineView.renderBodySlots();
    }

    renderTimelineHeaderTableSlots(): React.ReactNode {
        return this.timelineView.renderHeaderSlots();
    }

    renderTimelineDrawingBoardTable(collapseIds: Array<string>, timelineWidth: number): React.ReactNode {
        const drawElements = (resourceApi: ResourceApi) => {
            const milestoneApis = resourceApi.getMilestoneApis();
            const lineHeight = milestoneApis.length > 0 ? this.scheduleApi.getLineHeight() * 1.5 : this.scheduleApi.getLineHeight();
            return (
                <tr key={resourceApi.getId()}>
                    <td data-resource-id={resourceApi.getId()} className={`${fs_class}-timeline-lane ${fs_class}-resource`}>
                        <div className={`${fs_class}-timeline-lane-frame`} style={{height: lineHeight}}>
                            {this.timelineView.renderLane(resourceApi, timelineWidth)}
                            <div className={`${fs_class}-timeline-lane-bg`}></div>
                            {this.timelineView.renderEvents(resourceApi, timelineWidth)}
                            {this.timelineView.renderMilestones(resourceApi, timelineWidth)}
                            {this.timelineView.renderCheckpoints(resourceApi, timelineWidth)}
                        </div>
                    </td>
                </tr>
            )
        }
        const renderElements = (resourceApi: ResourceApi): Array<React.ReactNode> => {
            if (!collapseIds.some(resourceId => resourceId === resourceApi.getId()) && resourceApi.getChildren().length > 0) {
                const children = resourceApi.getChildren();
                return [drawElements(resourceApi), ...children.flatMap(child => renderElements(child))];
            } else {
                return [drawElements(resourceApi)];
            }
        }
        return (
            <tbody>
            {this.scheduleApi.getResourceApis().flatMap(resourceApi => renderElements(resourceApi))}
            </tbody>
        );
    }

    renderResourceTableColgroup(): React.ReactNode {
        const resourceAreaColumns = this.scheduleApi.getResourceAreaColumns();
        return <FullScheduleResourceTableColgroup resourceAreaColumns={resourceAreaColumns}/>;
    }

    renderResourceLabel(): React.ReactNode {
        const resourceAreaColumns = this.scheduleApi.getResourceAreaColumns();
        return (
            <thead>
            <tr role={row}>
                {
                    resourceAreaColumns.map((resourceAreaColumn, index) => <FullScheduleResourceLabelCell key={resourceAreaColumn.field}
                                                                                                          scheduleApi={this.scheduleApi}
                                                                                                          resourceAreaColumn={resourceAreaColumn}
                                                                                                          isResizable={index != resourceAreaColumns.length - 1}/>)
                }
            </tr>
            </thead>
        )
    }

    renderResourceLane(collapseIds: Array<string>): React.ReactNode {
        const resourceApis = this.scheduleApi.getResourceApis();
        const resourceAreaColumns = this.scheduleApi.getResourceAreaColumns();
        const renderResource = (resourceApi: ResourceApi) => {
            return resourceAreaColumns.map((resourceAreaColumn, index) => <FullScheduleResourceLaneCell
                key={resourceAreaColumn.field}
                scheduleApi={this.scheduleApi}
                resourceApi={resourceApi}
                collapseIds={collapseIds}
                showPlusSquare={index === 0}
                showIndentation={true}
                resourceAreaColumn={resourceAreaColumn}/>)
        }

        const renderTableRows = (resourceApi: ResourceApi): Array<React.ReactNode> => {
            if (!collapseIds.some((resourceId: string) => resourceId === resourceApi.getId()) && resourceApi.getChildren().length > 0) {
                const children = resourceApi.getChildren();
                return [<tr key={resourceApi.getId()} role={row}>{renderResource(resourceApi)}</tr>, ...children.flatMap(child => renderTableRows(child))];
            } else {
                return [<tr key={resourceApi.getId()} role={row}>{renderResource(resourceApi)}</tr>];
            }
        }

        return (
            <tbody>
            {
                resourceApis.flatMap(resourceApi => {
                    return renderTableRows(resourceApi)
                })
            }
            </tbody>
        );
    }

    getTimelineView(): TimelineView {
        return this.timelineView;
    }

    getScheduleApi(): ScheduleApi {
        return this.scheduleApi;
    }

    getScheduleElRef():  MutableRefObject<HTMLDivElement | null> {
        return this.scheduleElRef;
    }
}