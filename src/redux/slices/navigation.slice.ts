import AppConfig from "@/common/AppConfig";
import { ConsoleProjectResponse } from "@/types/response.type";
import { GlobalNotiProp, Lang } from "@/types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";

type NavigationState = {
  activeKey: string;
  isNavOpen: boolean;
  isHover: boolean;
};

const initialState: NavigationState = {
  activeKey: "api/reports",
  isNavOpen: window.innerWidth >= 768,
  isHover: false,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveKey(state, action: PayloadAction<any>) {
      state.activeKey = action.payload;
    },
    setNavOpen(state, action: PayloadAction<any>) {
      state.isNavOpen = action.payload;
    },
    setNavHover(state, action: PayloadAction<any>) {
      state.isHover = action.payload;
    },
  },
});
export const { setActiveKey, setNavOpen, setNavHover } =
  navigationSlice.actions;

export default navigationSlice.reducer;
