import BreadCrumbLink from "@/components/BreadCrumbLink";
import { RouteExtends } from "@/types/types";
import NotificationPage from ".";

export const notificationRouter: RouteExtends[] = [
  {
    path: "/notification",
    canGuard: true,
    element: <NotificationPage />, // dùng popup thì tất các các path đều chung 1 compoent
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"notification"} label="notification" />
      ),
      // roles: ["admin"],
      // permissions:["//.create"],
    },
  },
];
