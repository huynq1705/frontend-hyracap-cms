import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "dayjs/locale/en";
import "dayjs/locale/vi";
import { memo, useEffect } from "react";
import GlobalNoti from "./components/GlobalNoti";
import AppRouter from "./routers/AppRouter";
import theme from "./theme/theme";
import "./types/global";
import { I18nextProvider, withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectLang } from "./redux/selectors/app.selector";
import i18n from "./i18n/i18n";
import setCSSVariables from "./themeVariables";
import { requestPermission, onMessageListener } from "./utils/firebase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 3000,
    },
  },
});
const App = (): JSX.Element => {
  const lang = useSelector(selectLang);
  const AppContainer = withTranslation()(AppRouter);
  useEffect(() => {
    setCSSVariables(theme);
    requestPermission().then((token) => {
      console.log(token);
    });
    onMessageListener().then((payload: any) => {
      console.log("payload", payload);
    });
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalNoti />
            <AppContainer />
          </ThemeProvider>
        </I18nextProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default memo(App);
