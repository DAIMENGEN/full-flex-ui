import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {FullScheduleDispatch, FullScheduleState} from "./full-schedule-store";

export const useFullScheduleDispatch = () => useDispatch<FullScheduleDispatch>();
export const useFullScheduleSelector: TypedUseSelectorHook<FullScheduleState> = useSelector;