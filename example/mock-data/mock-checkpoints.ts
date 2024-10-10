import * as dayjs from "dayjs";
import {Checkpoint} from "../../dist/modules/full-schedule";

export const mockCheckpoints: Array<Checkpoint> = [
    {
        id: "1",
        title: "Test Condition Monitor",
        color: "green",
        timestamp: dayjs("2024-09-05"),
        resourceId: "8056891328444594143",
    },
]