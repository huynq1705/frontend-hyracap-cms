import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PageState = {
  page: {
    totalItems: number;
  };
};

const initialState: PageState = {
  page: {
    totalItems: 10,
  },
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setTotalItems(state, action: PayloadAction<any>) {
      state.page.totalItems = action.payload;
    },
  },
});
export const { setTotalItems } = pageSlice.actions;

export default pageSlice.reducer;
