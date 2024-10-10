// Used to denote content that is difficult to categorize into specific categories.

import {MountArg} from "../../../common/models/common";
import {PublicResourceApi} from "./resource";
import dayjs from "dayjs";

export type SelectInfoArg = MountArg<{
    resourceApi: PublicResourceApi,
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
}>;