import { combineReducers } from "@reduxjs/toolkit";
import { combineEpics } from "redux-observable";
import userSlice from "./slices/user.slice";
import appSlice from "./slices/app.slice";
import navigationSlice from "./slices/navigation.slice";
import pageSlice from "./slices/page.slice";
import dataOrderScheduleSlice from "./slices/dataOrderSchedule.slice";
import checkPanigationSlice from "./slices/checkPanigation.slice";

export const rootEpic = combineEpics();

const rootReducer = combineReducers({
    subTab: checkPanigationSlice,
    orderSchedule: dataOrderScheduleSlice,
    user: userSlice,
    app: appSlice,
    navigation: navigationSlice,
    page: pageSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
