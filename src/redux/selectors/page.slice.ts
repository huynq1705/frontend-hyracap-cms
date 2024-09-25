import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootReducers";

export const selectPage = createSelector(
  (state: RootState) => state.page,
  (state) => state.page,
);
