import BreadCrumbLink from "@/components/BreadCrumbLink";
import Page from ".";
import EditPage from "./edit";

export const orderRouter = [
  {
    path: "/order/create",
    canGuard: true,
    element: <EditPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"order"} label="order" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/order/view/:code",
    canGuard: true,
    element: <EditPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"order"} label="order" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/order",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"order"} label="label-product" />,
      // roles: ["admin"],
    },
  },
];
