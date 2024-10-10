import React, {useCallback, useEffect, useRef} from "react";
import {Dropdown} from "antd";
import {columnheader, fs_class} from "../../../../constants";
import {ResourceAreaColumn} from "../../../../models/resource";
import {ScheduleApi} from "../../../../models/schedule";
import {StyleUtil} from "../../../../../../common/utils/style-util";
import {ConditionalRenderer} from "../../../../../../common/components/conditional-renderer";
import {useResourceLabelMount} from "../../../../hooks/mounts/useResourceLabelMount";

export const FullScheduleResourceLabelCell: React.FC<{ scheduleApi: ScheduleApi, resourceAreaColumn: ResourceAreaColumn, isResizable: boolean }> = (props) => {
    const indexRef = useRef<number>(-1);
    const resourceLabelCellRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const index = indexRef.current;
        const datagridHeader = document.querySelector(`.${fs_class}-datagrid-header`);
        const datagridBody = document.querySelector(`.${fs_class}-datagrid-body`);
        const headerColgroup = datagridHeader?.firstElementChild;
        const bodyColgroup = datagridBody?.firstElementChild;
        const headerColElements = headerColgroup?.children;
        const bodyColElements = bodyColgroup?.children
        if (headerColElements && bodyColElements) {
            const targetHeaderColElement = headerColElements[index] as HTMLTableColElement;
            const targetBodyColElement = bodyColElements[index] as HTMLTableColElement;
            const headerColElementOffset = event.clientX - targetHeaderColElement.offsetLeft;
            const bodyColElementOffset = event.clientX - targetBodyColElement.offsetLeft;
            targetHeaderColElement.style.width = StyleUtil.numberToPixels(headerColElementOffset);
            targetBodyColElement.style.width = StyleUtil.numberToPixels(bodyColElementOffset);
        }
    }, []);

    const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const trElement = resourceLabelCellRef.current?.parentElement?.parentElement;
        if (trElement) {
            indexRef.current = -1;
            trElement.removeEventListener("mousemove", handleMouseMove);
        } else {
            console.error("trElement", trElement);
        }
    }, [handleMouseMove]);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(event => {
        event.preventDefault();
        const thElement = resourceLabelCellRef.current?.parentElement;
        const trElement = resourceLabelCellRef.current?.parentElement?.parentElement;
        if (trElement) {
            const thElements = trElement.getElementsByTagName("th");
            for (let i = 0; i < thElements.length; i++) {
                if (thElements[i] == thElement) {
                    indexRef.current = i;
                }
            }
            trElement.addEventListener("mousemove", handleMouseMove);
        } else {
            console.error("trElement", trElement);
        }
    }, [handleMouseMove]);

    useEffect(() => {
        const trElement = resourceLabelCellRef.current?.parentElement?.parentElement;
        if (trElement) {
            const mouseUpListener = (event: MouseEvent) => {
                event.preventDefault();
                indexRef.current = -1;
                trElement.removeEventListener("mousemove", handleMouseMove);
            }
            trElement.addEventListener("mouseup", mouseUpListener);
            return () => {
                trElement.removeEventListener("mouseup", mouseUpListener);
            }
        }
        return () => {}
    }, []);

    useResourceLabelMount(resourceLabelCellRef, props.resourceAreaColumn, props.scheduleApi);
    return (
        <th role={columnheader} className={`${fs_class}-datagrid-cell`}>
            <Dropdown disabled={!props.scheduleApi.isEnableResourceLabelContextMenu()}
                      destroyPopupOnHide={true}
                      trigger={["contextMenu"]}
                      menu={{
                          items: props.scheduleApi.getResourceLabelContextMenuItems(),
                          onClick: (arg) => {
                              const {key, keyPath, domEvent} = arg;
                              props.scheduleApi.onResourceLabelContextMenuClick({
                                  key: key,
                                  keyPath: keyPath,
                                  domEvent: domEvent,
                                  label: props.resourceAreaColumn,
                              });
                          }
                      }}>
                <div className={`${fs_class}-datagrid-cell-frame`} ref={resourceLabelCellRef}>
                    <div className={`${fs_class}-datagrid-cell-cushion ${fs_class}-scrollgrid-sync-inner`}>
                        <span className={`${fs_class}-datagrid-cell-main`}>{props.resourceAreaColumn.headerContent}</span>
                    </div>
                    <ConditionalRenderer condition={props.isResizable}>
                        <div className={`${fs_class}-datagrid-cell-resizer`} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}></div>
                    </ConditionalRenderer>
                </div>
            </Dropdown>
        </th>
    )
}