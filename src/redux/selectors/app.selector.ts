import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootReducers";

export const selectLang = createSelector(
  (state: RootState) => state.app,
  (state) => state.lang,
);
export const selectQueryClient = createSelector(
  (state: RootState) => state.app,
  (state) => state.queryClient,
);
export const selectGlobalNoti = createSelector(
  (state: RootState) => state.app,
  (state) => state.globalNoti,
);
export const selectSelectedConsoleItem = createSelector(
  (state: RootState) => state.app,
  (state) => state.selectedConsoleItem,
);
export const selectIsLoading = createSelector(
  (state: RootState) => state.app,
  (state) => state.isLoading,
);
