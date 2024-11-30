import localStorage from "redux-persist/lib/storage";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import resourceReducer from "./resource/resource-slice";

const reducers = combineReducers({
    resourceState: resourceReducer,
});

const persistConfig = {
    key: "full-schedule",
    storage: localStorage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const fullScheduleStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const fullSchedulePersistor = persistStore(fullScheduleStore);
export type FullScheduleDispatch = typeof fullScheduleStore.dispatch;
export type FullScheduleState = ReturnType<typeof fullScheduleStore.getState>;