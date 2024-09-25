import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../rootReducers";

export const selectOrderSchedule = createSelector(
  (state: RootState) => state.orderSchedule.customer,
  (state: RootState) => state.orderSchedule.list_service_id,
  (state: RootState) => state.orderSchedule.schedule_id,
  (customer, list_service_id, schedule_id) => ({
    customer,
    list_service_id,
    schedule_id,
  }),
);
