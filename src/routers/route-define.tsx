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
import { productCategoryRouter } from "@/apps/pages/productCategory/config";
import { productRouter } from "@/apps/pages/product/config";
import { addAdminPrefix } from "@/utils";
import HomePage from "@/apps/pages/dashboard";
import { contractRouter } from "@/apps/pages/contract/config";
import { transactionRouter } from "@/apps/pages/transaction/config";
import { adminRouter } from "@/apps/pages/admin/config";

//collections
//auth
const LoginModule = lazy(() => import("@/apps/pages/auth/Login/Login"));
const SignUpModule = lazy(() => import("@/apps/pages/auth/SignUp/SignUp"));
const ForgotPasswordModule = lazy(
    () => import("@/apps/pages/auth/ForgotPassword/ForgotPassword")
);
//404
const NotFoundModule = lazy(() => import("@/apps/pages/NotFound"));

const getAccessTokenAsync = () =>
    new Promise<string | null>((resolve, reject) => {
        const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
        resolve(accessToken);
    });
// add new page
const init_routes: RouteExtends[] = [
    {
        path: "/login",
        element: <LoginModule />,
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
                .get<UserInfo>(
                    `${AppConfig.API_URL}${AppConfig.USER.GET_PROFILE}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                )
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
            ...adminRouter,
            ...productCategoryRouter,
            ...productRouter,
            ...contractRouter,
            ...transactionRouter,
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
