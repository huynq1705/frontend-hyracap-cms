import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootReducers";

export const selectLogo = createSelector(
    (state: RootState) => state.logo,
    (state) => state.logo,
);
