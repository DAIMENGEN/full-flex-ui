import {combineReducers, configureStore} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from "redux-persist";
import resourceReducer from "./resource/resource-slice";

const reducers = combineReducers({
    resourceState: resourceReducer,
});

const persistConfig = {
    key: "full-schedule",
    storage: AsyncStorage,
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