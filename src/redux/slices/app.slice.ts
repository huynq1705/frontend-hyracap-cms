import AppConfig from "@/common/AppConfig";
import { ConsoleProjectResponse } from "@/types/response.type";
import { GlobalNotiProp, Lang } from "@/types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";

type AppState = {
  lang: Lang;
  globalNoti: GlobalNotiProp | null;
  queryClient: QueryClient;
  selectedConsoleItem: ConsoleProjectResponse | null;
  isAskedSelectConsole: boolean;
  isLoading: boolean;
};

type AppAction = {
  setLang: (lang: Lang) => void;
  setGlobalNoti: (props: GlobalNotiProp | null) => void;
  setSelectedConsoleItem: (
    selectedConsoleItem: ConsoleProjectResponse | null,
  ) => void;
  setIsAskedSelectConsole: (isAskedSelectConsole: boolean) => void;
  reset: () => void;
};

const initialState: AppState = {
  lang:
    (localStorage.getItem(AppConfig.LANG_TOKEN) as Lang | undefined) ?? "vi",
  globalNoti: null,
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: true,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: 1,
        retryDelay: 3000,
      },
    },
  }),
  selectedConsoleItem: null,
  isAskedSelectConsole: Boolean(
    localStorage.getItem(AppConfig.PROJECT_NAME_TOKEN),
  ),
  isLoading: false,
};

const appSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<any>) {
      localStorage.setItem("lang", action.payload);
      state.lang = action.payload;
    },
    setGlobalNoti(state, action: PayloadAction<any>) {
      state.globalNoti = action.payload;
    },
    setSelectedConsoleItem(state, action: PayloadAction<any>) {
      localStorage.setItem(
        AppConfig.PROJECT_NAME_TOKEN,
        state.selectedConsoleItem?.project_name ?? "",
      );
      state.selectedConsoleItem = action.payload;
    },
    setIsAskedSelectConsole(state, action: PayloadAction<any>) {
      localStorage.setItem(
        AppConfig.PROJECT_NAME_TOKEN,
        state.selectedConsoleItem?.project_name ?? "",
      );
      state.isAskedSelectConsole = action.payload;
    },
    setIsLoading(state, action: PayloadAction<any>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setLang,
  setGlobalNoti,
  setSelectedConsoleItem,
  setIsAskedSelectConsole,
  setIsLoading,
} = appSlice.actions;

export default appSlice.reducer;
