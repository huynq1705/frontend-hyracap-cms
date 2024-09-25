// src/redux/slices/orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  customer: {
    id: number;
    full_name: string;
    phone_number: string;
    email: string;
  } | null;
  list_service_id: number[];
  schedule_id: number | null;
}

const initialState: OrderState = {
  customer: null,
  list_service_id: [],
  schedule_id: null,
};

const orderScheduleSlice = createSlice({
  name: "orderSchedule",
  initialState,
  reducers: {
    setCustomerId(
      state,
      action: PayloadAction<{
        id: number;
        full_name: string;
        phone_number: string;
        email: string;
        schedule_id: number | null;
      } | null>,
    ) {
      if (action.payload && action.payload.id) {
        state.customer = action.payload;
        state.schedule_id = action.payload.schedule_id;
      }
    },
    setListServiceId(state, action: PayloadAction<number[]>) {
      state.list_service_id = action.payload;
    },
  },
});

export const { setCustomerId, setListServiceId } = orderScheduleSlice.actions;
export default orderScheduleSlice.reducer;
