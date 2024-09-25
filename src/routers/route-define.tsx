import AppConfig from "@/common/AppConfig";
import BreadCrumbLink from "@/components/BreadCrumbLink";
import Layout from "@/layouts/Layout";
import LayoutContainer from "@/layouts/LayoutContainer";
import { RouteExtends, UserInfo } from "@/types/types";
import axios from "axios";
import { lazy } from "react";
import { Navigate, defer } from "react-router-dom";
import NavigateRoute from "./NavigateRoute";
import CErrorBoundary from "@/components/CErrorBoundary";
import { serviceRouter } from "@/apps/pages/service/config";
import { productCategoryRouter } from "@/apps/pages/productCategory/config";
import { productRouter } from "@/apps/pages/product/config";
import { managementRouter } from "@/apps/pages/management/config";
import { paymentRouter } from "@/apps/pages/payment/config";
import { appointmentStatusRouter } from "@/apps/pages/appointmentStatus/config";
import { customerRouter } from "@/apps/pages/customer/config";
import { customerClassificationRouter } from "@/apps/pages/customerClassification/config";
import { scheduleRouter } from "@/apps/pages/schedule/config";
import MakeAnAppointmentPage from "@/apps/pages/makeAnAppointment";
import { prepaidCardFaceValueRouter } from "@/apps/pages/prepaidCardFaceValue/config";
import { addAdminPrefix } from "@/utils";
import { orderRouter } from "@/apps/pages/order/config";
import { systemsRouter } from "@/apps/pages/systems/config";
import HomePage from "@/apps/pages/dashboard";
import { reportRouter } from "@/apps/pages/reports/config";
import { treatmentRouter } from "@/apps/pages/treatment/config";
import { serviceMedia } from "@/apps/pages/media/config";
import { serviceBank } from "@/apps/pages/bank/config";
import { prepaidCardFaceRouter } from "@/apps/pages/prepaidCardFace/config";
import { treatmentOrderRouter } from "@/apps/pages/treatmentCategory/config";
import { configScheduleRouter } from "@/apps/pages/configSchedule/config";
import EvaluateFromCustomerPage from "@/apps/pages/evaluateFromCustomer";
import { systemsEvaluation } from "@/apps/pages/evaluations/config";

//collections
//auth
const LoginModule = lazy(() => import("@/apps/pages/auth/Login/Login"));
const SignUpModule = lazy(() => import("@/apps/pages/auth/SignUp/SignUp"));
const ForgotPasswordModule = lazy(
  () => import("@/apps/pages/auth/ForgotPassword/ForgotPassword"),
);
//404
const NotFoundModule = lazy(() => import("@/apps/pages/NotFound"));
const GetStartModule = lazy(() => import("@/apps/pages/getStart/index"));

const getAccessTokenAsync = () =>
  new Promise<string | null>((resolve, reject) => {
    const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
    resolve(accessToken);
  });
// add new page
const init_routes: RouteExtends[] = [
  {
    path: "/",
    element: <MakeAnAppointmentPage />,
    canGuard: false,
    isPagePublic: true,
  },
  {
    path: "/evaluate/:code",
    element: <EvaluateFromCustomerPage />,
    canGuard: false,
    isPagePublic: true,
  },
  {
    path: "/schedule/:code",
    element: <MakeAnAppointmentPage />,
    canGuard: false,
    isPagePublic: true,
  },
  {
    path: "/login",
    element: <LoginModule />,
    canGuard: false,
  },
  {
    path: "/get-start",
    element: <GetStartModule />,
    canGuard: false,
  },
  {
    path: "/account",
    element: <SignUpModule />,
    canGuard: false,
  },
  {
    path: "/account/forgot-password",
    element: <ForgotPasswordModule />,
    canGuard: false,
  },
  {
    path: "/",
    loader: async () => {
      const accessToken = await getAccessTokenAsync();
      const userInfo = axios
        .get<UserInfo>(`${AppConfig.API_URL}${AppConfig.USER.GET_PROFILE}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((r) => r.data);

      return defer({
        userInfo: userInfo,
      });
    },
    element: (
      <Layout>
        <LayoutContainer />
      </Layout>
    ),
    errorElement: <CErrorBoundary />,
    canGuard: true,
    children: [
      {
        path: "/",
        element: <HomePage />,
        canGuard: true,
        handle: {
          crumb: () => <BreadCrumbLink linkTo={"404"} />,
        },
      },
      ...configScheduleRouter,
      ...treatmentRouter,
      ...treatmentOrderRouter,
      ...prepaidCardFaceRouter,
      ...reportRouter,
      ...orderRouter,
      ...prepaidCardFaceValueRouter,
      ...appointmentStatusRouter,
      ...productCategoryRouter,
      ...customerClassificationRouter,
      ...productRouter,
      ...serviceRouter,
      ...managementRouter,
      ...systemsEvaluation,
      ...customerRouter,
      ...scheduleRouter,
      ...treatmentRouter,
      ...systemsRouter,
      ...serviceMedia,
      ...serviceBank,
      {
        path: "/404",
        element: <NotFoundModule />,
        canGuard: true,
        handle: {
          crumb: () => <BreadCrumbLink linkTo={"404"} />,
        },
      },
      {
        path: "*",
        element: <NavigateRoute to="/admin/404" />,
        canGuard: true,
      },
    ],
  },
];
const routes = addAdminPrefix(init_routes);
export default routes;
