import "../dist/full-flex-ui.css";
import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom/client";
import {FullColorPicker, FullDraggableModal, FullSchedule, FullTreeAdjuster} from "../dist";
import {mockResources} from "./mock-data/mock-resources";
import {mockEvents} from "./mock-data/mock-events";
import {mockCheckpoints} from "./mock-data/mock-checkpoints";
import {mockMilestones} from "./mock-data/mock-milestones";
import * as dayjs from "dayjs";
import {Button, Tabs} from "antd";
import {
    CheckpointMoveMountArg,
    EventContextMenuArg,
    EventMountArg,
    EventMoveMountArg,
    EventResizeMountArg,
    MilestoneMountArg,
    MilestoneMoveMountArg,
    ResourceLabelContextMenuArg,
    ResourceLabelMountArg,
    ResourceLaneContextMenuArg,
    ResourceLaneMountArg,
    ScheduleMountArg,
    SelectInfoArg,
} from "../dist/modules/full-schedule";

const App = () => {
    const [openFullDraggableModel, setOpenFullDraggableModel] = useState(false);
    return (
        <div style={{padding: 50}}>
            <Tabs defaultActiveKey={"1"} items={[
                {
                    key: "1",
                    label: "FullSchedule",
                    forceRender: false,
                    children: <FullSchedule start={dayjs("2024-08-10")}
                                            end={dayjs("2024-09-09")}
                                            editable={true}
                                            selectable={true}
                                            lineHeight={40}
                                            slotMinWidth={50}
                                            scheduleMaxHeight={1000}
                                            scheduleViewType={"Day"}
                                            resources={mockResources}
                                            events={mockEvents}
                                            checkpoints={mockCheckpoints}
                                            milestones={mockMilestones}
                                            enableEventContextMenu={true}
                                            selectAllow={(arg: SelectInfoArg) => {
                                                console.log("resourceTitle: ", arg.resourceApi.getTitle());
                                                console.log("startDate: ", arg.startDate.format("YYYY-MM-DD"));
                                                console.log("endDate: ", arg.endDate.format("YYYY-MM-DD"));
                                            }}
                                            eventContextMenuItems={[
                                                {
                                                    title: "123",
                                                    label: "event lane",
                                                }
                                            ]}
                                            eventContextMenuClick={(arg: EventContextMenuArg) => {
                                                // alert(arg.eventApi.getTitle());
                                            }}
                                            eventDidMount={(arg: EventMountArg) => {
                                                // console.log(arg);
                                            }}
                                            eventMove={(arg: EventMoveMountArg) => {
                                                console.log("el", arg.el);
                                                console.log("title", arg.eventApi.getTitle());
                                                console.log("startDate", arg.startDate.format("YYYY-MM-DD"));
                                                console.log("endDate", arg.endDate.format("YYYY-MM-DD"));
                                                console.log("scheduleApi", arg.scheduleApi);
                                            }}
                                            eventResizeEnd={(arg: EventResizeMountArg) => {
                                                console.log("el", arg.el);
                                                console.log("title", arg.eventApi.getTitle());
                                                console.log("date", arg.date.format("YYYY-MM-DD"));
                                                console.log("scheduleApi", arg.scheduleApi);
                                            }}
                                            eventResizeStart={(arg: EventResizeMountArg) => {
                                                console.log("el", arg.el);
                                                console.log("title", arg.eventApi.getTitle());
                                                console.log("date", arg.date.format("YYYY-MM-DD"));
                                                console.log("scheduleApi", arg.scheduleApi);
                                            }}
                                            enableResourceLabelContextMenu={true}
                                            resourceLabelContextMenuItems={[
                                                {
                                                    title: "123",
                                                    label: "resource label",
                                                }
                                            ]}
                                            resourceLabelContextMenuClick={(arg: ResourceLabelContextMenuArg) => {
                                                alert(arg.label.headerContent);
                                            }}
                                            resourceLabelDidMount={(arg: ResourceLabelMountArg) => {
                                                // console.log(arg);
                                            }}
                                            enableResourceLaneContextMenu={true}
                                            resourceLaneContextMenuItems={[
                                                {
                                                    title: "123",
                                                    label: "resource lane",
                                                }
                                            ]}
                                            resourceLaneContextMenuClick={(arg: ResourceLaneContextMenuArg) => {
                                                // alert(arg.resourceApi.getTitle());
                                            }}
                                            resourceLaneDidMount={(arg: ResourceLaneMountArg) => {
                                                // console.log(arg)
                                            }}
                                            milestoneDidMount={(arg: MilestoneMountArg) => {
                                                const {el, milestoneApi} = arg;
                                                el.title = milestoneApi.getTitle();
                                            }}
                                            milestoneMove={(arg: MilestoneMoveMountArg) => {
                                                console.log("el", arg.el);
                                                console.log("title", arg.milestoneApi.getTitle());
                                                console.log("date", arg.date.format("YYYY-MM-DD"));
                                                console.log("scheduleApi", arg.scheduleApi);
                                                console.log("milestoneApi", arg.milestoneApi);
                                            }}
                                            checkpointMove={(arg: CheckpointMoveMountArg) => {
                                                console.log("el", arg.el);
                                                console.log("title", arg.checkpointApi.getTitle());
                                                console.log("date", arg.date.format("YYYY-MM-DD"));
                                                console.log("scheduleApi", arg.scheduleApi);
                                                console.log("checkpointApi", arg.checkpointApi);
                                            }}
                                            scheduleDidMount={(arg: ScheduleMountArg) => {
                                                console.log("el", arg.el);
                                                console.log("scheduleApi", arg.scheduleApi);
                                            }}
                    />
                },
                {
                    key: "2",
                    label: "FullColorPicker",
                    children: <FullColorPicker/>,
                },
                {
                    key: "3",
                    label: "FullTreeAdjuster",
                    children: <FullTreeAdjuster treeNodes={[
                        {id: "0-0", title: "0-0", parentId: null, order: 2},
                        {id: "0-0-0", title: "0-0-0", parentId: "0-0"},
                        {id: "0-0-0-0", title: "0-0-0-0", parentId: "0-0-0"},
                        {id: "0-0-0-1", title: "0-0-0-1", parentId: "0-0-0"},
                        {id: "0-0-0-2", title: "0-0-0-2", parentId: "0-0-0"},
                        {id: "0-0-1", title: "0-0-1", parentId: "0-0"},
                        {id: "0-0-1-0", title: "0-0-1-0", parentId: "0-0-1"},
                        {id: "0-0-1-1", title: "0-0-1-1", parentId: "0-0-1", order: -1},
                        {id: "0-0-1-2", title: "0-0-1-2", parentId: "0-0-1"},
                        {id: "0-0-2", title: "0-0-2", parentId: "0-0"},
                        {id: "0-1", title: "0-1", parentId: null, order: -1},
                        {id: "0-1-0-0", title: "0-1-0-0", parentId: "0-1"},
                        {id: "0-1-0-1", title: "0-1-0-1", parentId: "0-1"},
                        {id: "0-1-0-2", title: "0-1-0-2", parentId: "0-1"},
                        {id: "0-2", title: "0-2", parentId: null, order: 3}
                    ]} onAdjust={(childrenIds: Array<string>, parentId: string | undefined) => {
                        console.log("childrenIds", childrenIds);
                        console.log("parentId", parentId);
                    }}/>,
                },
                {
                    key: "4",
                    label: "FullDraggableModal",
                    children: <div>
                        <Button type={`primary`}
                                onClick={() => setOpenFullDraggableModel(true)}>OpenFullDraggableModel</Button>
                        <FullDraggableModal title="Full Draggable Modal"
                                            destroyOnClose={true}
                                            open={openFullDraggableModel}
                                            onOk={() => setOpenFullDraggableModel(false)}
                                            onCancel={() => setOpenFullDraggableModel(false)}
                                            closable={true}>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                            <div style={{width: 200}}>哈哈哈哈哈</div>
                        </FullDraggableModal>
                    </div>
                }
            ]}/>
        </div>
    )
};

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
