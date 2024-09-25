import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootReducers";


export const selectUserInfo = createSelector(
    (state: RootState) => state.user,
    (state) => state.userInfo
)
