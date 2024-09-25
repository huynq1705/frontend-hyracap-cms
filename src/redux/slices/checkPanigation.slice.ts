import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface SubTabState {
    subTab: boolean;
}

const initialState: SubTabState = {
    subTab: false,
};

const checkPanigationSlice = createSlice({
    name: "subTab",
    initialState,
    reducers: {
        setSubTab: (state, action: PayloadAction<boolean>) => {
            state.subTab = action.payload;
        },
    },
});

export const { setSubTab } = checkPanigationSlice.actions;
export default checkPanigationSlice.reducer;
