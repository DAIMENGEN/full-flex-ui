import React from "react";
import "./styles/full-schedule.scss";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {fullSchedulePersistor, fullScheduleStore} from "../features/full-schedule-store";
import {FullScheduleGanttChart} from "./gantt-chart/full-schedule-gantt-chart";
import {ScheduleProps} from "../models/schedule";

export const FullSchedule: React.FC<ScheduleProps> = (props) => {
    return (
        <Provider store={fullScheduleStore}>
            <PersistGate persistor={fullSchedulePersistor} loading={null}>
                <FullScheduleGanttChart {...props}/>
            </PersistGate>
        </Provider>
    )
}