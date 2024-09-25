import { configureStore } from "@reduxjs/toolkit";
import checkPanigationSlice from "../slices/checkPanigation.slice";

const store = configureStore({
    reducer: {
        subTab: checkPanigationSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
