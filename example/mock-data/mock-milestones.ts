import * as dayjs from "dayjs";
import {Milestone} from "../../dist/modules/full-schedule";

export const mockMilestones: Array<Milestone> = [
    {
        id: "1",
        title: "milestone1",
        timestamp: dayjs("2024-08-31"),
        status: "Success",
        resourceId: "8638818878966724025",
    }
]