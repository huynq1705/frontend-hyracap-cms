import {
  PermissionType,
  RouteExtends,
  RouteLoaderType,
  UserInfo,
  UserRole,
} from "@/types/types";
import React, { Suspense, memo, useEffect, useMemo, useState } from "react";
import {
  Navigate,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom";
import NavigateRoute from "./NavigateRoute";
import RouteLoading from "./RouteLoading";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/slices/user.slice";

type ResolvedRouteProps = {
  userInfo: UserInfo;
  route: RouteExtends;
  children: React.ReactNode;
};
const ResolvedRoute = memo(
  ({ userInfo, route, children }: ResolvedRouteProps): JSX.Element => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const matches = useMatches();
    const location = useLocation();
    const { pathname, search } = location;
    const roles = useMemo(() => {
      const match = matches.find((match: any) =>
        Boolean(match.handle?.roles),
      ) as any;
      return match?.handle?.roles as UserRole[] | undefined;
    }, [matches]);
    const canAccess = useMemo(() => !!userInfo, [userInfo]);
    useEffect(() => {
      dispatch(setUserInfo(userInfo));
    }, [userInfo]);

    if (!canAccess && route.canGuard && pathname.includes("admin")) {
      navigate(`/admin/login?redirect=${pathname}${search}`);
      // return <></>;
      return <Navigate to={"/admin/products"} />;
    }

    if (!roles || (userInfo?.role && roles.includes(userInfo?.role.name))) {
      return <>{children}</>;
    }
    // return <Navigate to={"/404"} />;
    return <Navigate to={"/admin/products"} />;
  },
);

type ResolvedDataType = any;

type AwaitRouteProps = {
  resolve: Promise<any>;
  errorElement: React.ReactNode;
  children: (resolvedData: any) => React.ReactNode;
};

const AwaitRoute = memo(
  ({ resolve, errorElement, children }: AwaitRouteProps): JSX.Element => {
    const [routeState, setRouteState] = useState<
      "loading" | "error" | ResolvedDataType
    >("loading");

    useEffect(() => {
      async function runPromise() {
        await resolve
          .then((res) => {
            setRouteState(res.data);
          })
          .catch((e) => {
            setRouteState("error");
          });
      }
      runPromise();
    }, [resolve]);

    const renderByState = () => {
      switch (routeState) {
        case "loading": {
          return <RouteLoading />;
        }
        case "error": {
          return errorElement;
        }
        default: {
          return children(routeState);
        }
      }
    };

    return <>{renderByState()}</>;
  },
);

type AuthRouteProps = {
  children: React.ReactNode;
  route: RouteExtends;
};

const AuthRoute = ({ children, route }: AuthRouteProps): JSX.Element => {
  const loaderData = useLoaderData() as RouteLoaderType;
  const location = useLocation();
  const { pathname, search } = location;
  return (
    <Suspense fallback={<RouteLoading />}>
      {route.canGuard
        ? loaderData && (
            <AwaitRoute
              resolve={loaderData.userInfo}
              errorElement={
                <NavigateRoute
                  to={`/admin/login?redirect=${pathname}${search}`}
                />
              }
              children={(resolvedData) => (
                <ResolvedRoute route={route} userInfo={resolvedData}>
                  {children}
                </ResolvedRoute>
              )}
            />
          )
        : children}
    </Suspense>
  );
};

export default memo(AuthRoute);
