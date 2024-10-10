import React, {useCallback, useRef} from "react";
import {Dropdown, Space} from "antd";
import {fs_class, gridcell} from "../../../../constants";
import {Resource, ResourceApi, ResourceAreaColumn} from "../../../../models/resource";
import {ScheduleApi} from "../../../../models/schedule";
import {useFullScheduleDispatch} from "../../../../features/full-schedule-hook";
import {MinusSquareOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {collapseResource, expandedResource} from "../../../../features/resource/resource-slice";
import {StyleUtil} from "../../../../../../common/utils/style-util";
import {useResourceLaneMount} from "../../../../hooks/mounts/useResourceLaneMount";

export const FullScheduleResourceLaneCell: React.FC<{scheduleApi: ScheduleApi, resourceApi: ResourceApi, collapseIds: Array<string>, showPlusSquare: boolean, showIndentation: boolean, resourceAreaColumn: ResourceAreaColumn }> = (props) => {
    const scheduleDispatch = useFullScheduleDispatch();
    const resourceLaneCellRef = useRef<HTMLDivElement | null>(null);
    const timelineView = props.scheduleApi.getScheduleView().getTimelineView();
    const laneHeight = timelineView.calculateLaneHeight(props.resourceApi);
    const getResourceColumnValue = useCallback((column: string, resourceApi: ResourceApi): string | number | undefined | null => {
        const resource = resourceApi.getResource();
        const properties = Object.keys(resource);
        if (properties.includes(column)) {
            const property = column as keyof Resource;
            return (property !== "extendedProps" && property !== "tooltip") ? resource[property] : undefined
        } else {
            const extendedProps = resource.extendedProps;
            return extendedProps ? extendedProps[column] : undefined;
        }
    }, []);
    useResourceLaneMount(resourceLaneCellRef, props.resourceAreaColumn, props.scheduleApi, props.resourceApi);
    return (
        <td role={gridcell} data-resource-id={props.resourceApi.getId()}  className={`${fs_class}-datagrid-cell ${fs_class}-resource`}>
            <Dropdown disabled={!props.scheduleApi.isEnableResourceLaneContextMenu()}
                      destroyPopupOnHide={true}
                      trigger={["contextMenu"]}
                      menu={{
                          items: props.scheduleApi.getResourceLaneContextMenuItems(),
                          onClick: (arg) => {
                              const {key, keyPath, domEvent} = arg;
                              props.scheduleApi.onResourceLaneContextMenuClick({
                                  key: key,
                                  keyPath: keyPath,
                                  domEvent: domEvent,
                                  scheduleApi: props.scheduleApi,
                                  resourceApi: props.resourceApi,
                                  label: props.resourceAreaColumn,
                              });
                          }
                      }}>
                <div className={`${fs_class}-datagrid-cell-frame`} style={{height: StyleUtil.numberToPixels(laneHeight)}} ref={resourceLaneCellRef}>
                    <div className={`${fs_class}-datagrid-cell-cushion ${fs_class}-scrollgrid-sync-inner`}>
                        <Space size={`small`}>
                            {
                                props.showPlusSquare && (
                                    <span className={`${fs_class}-datagrid-expander ${fs_class}-datagrid-expander-placeholder`}>
                                    {
                                        props.showIndentation && Array.from({length: props.resourceApi.getDepth()}, (_, index) =>
                                            <span key={index + 1} className={`${fs_class}-icon`}/>)
                                    }
                                        <span className={`${fs_class}-icon`}>
                                        {
                                            props.collapseIds.some((resourceId: string) => resourceId === props.resourceApi.getId()) ?
                                                <PlusSquareOutlined
                                                    onClick={() => scheduleDispatch(expandedResource(props.resourceApi.getId()))}/> :
                                                props.resourceApi.getChildren().length > 0 ? <MinusSquareOutlined
                                                    onClick={() => scheduleDispatch(collapseResource(props.resourceApi.getId()))}/> : null
                                        }
                                    </span>
                                </span>
                                )
                            }
                            <div className={`${fs_class}-datagrid-cell-main`}>
                                {getResourceColumnValue(props.resourceAreaColumn.field, props.resourceApi)}
                            </div>
                        </Space>
                    </div>
                </div>
            </Dropdown>
        </td>
    )
}