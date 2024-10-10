import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ResourceState {
    collapseIds: Array<string>;
    resourceAreaWidth: string;
}

const initialState: ResourceState = {
    collapseIds: Array.of<string>(),
    resourceAreaWidth: "20%",
}

const resourceSlice = createSlice({
    name: "resource",
    initialState,
    reducers: {
        collapseResource(state, action: PayloadAction<string>) {
            state.collapseIds = [...state.collapseIds, action.payload];
        },
        expandedResource(state, action: PayloadAction<string>) {
            state.collapseIds = state.collapseIds.filter(resourceId => resourceId !== action.payload);
        },
        changeResourceAreaWidth(state, action: PayloadAction<string>) {
            const oldWidth = state.resourceAreaWidth;
            const newWidth = action.payload;
            (oldWidth !== newWidth) && (state.resourceAreaWidth = newWidth);
        }
    }
});

export const { collapseResource, expandedResource, changeResourceAreaWidth } = resourceSlice.actions;
export default resourceSlice.reducer;