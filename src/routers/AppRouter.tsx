import _ from "lodash";
import { Suspense, memo } from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import AuthRoute from "./AuthRoute";
import RouteLoading from "./RouteLoading";
import routes from "./route-define";
import { useSelector } from "react-redux";
import { selectIsLoading } from "@/redux/selectors/app.selector";

const router = createBrowserRouter(
  routes.map((route: any) => ({
    ...(_.omit(route, "canGuard") as RouteObject),
    element: (
      <Suspense fallback={<RouteLoading />}>
        <AuthRoute route={route}>{route.element}</AuthRoute>
      </Suspense>
    ),
  })),
);

const AppRouter = (): JSX.Element => {
  const isLoading = useSelector(selectIsLoading);
  if (isLoading)
    return (
      <div className="">
        <RouteLoading />
      </div>
    );
  return <RouterProvider router={router} />;
};
export default memo(AppRouter);
