import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootReducers";


export const selectIsNavOpen = createSelector(
    (state: RootState) => state.navigation,
    (state) => state.isNavOpen
)
export const selectActiveKey = createSelector(
    (state: RootState) => state.navigation,
    (state) => state.activeKey
)
export const selectIsNavHover = createSelector(
  (state: RootState) => state.navigation,
  (state) => state.isHover,
);
