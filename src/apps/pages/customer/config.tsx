import BreadCrumbLink from "@/components/BreadCrumbLink";
import CustomerPage from ".";
import DetailPage from "./components/detail";

export const customerRouter = [
  {
    path: "/customer",
    canGuard: true,
    element: <CustomerPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"admin"} label="Create-admin" />,
      role: ["admin"],
    },
  },
  {
    path: "/customer/create",
    canGuard: true,
    element: <CustomerPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"customer"} label="customer" />,
    },
  },
  {
    path: "/customer/view/:code",
    canGuard: true,
    element: <DetailPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"customer"} label="customer" />,
    },
  },
  {
    path: "/customer/view/:tag/:code",
    canGuard: true,
    element: <DetailPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"customer"} label="customer" />,
    },
  },
  {
    path: "/customer/edit/:code",
    canGuard: true,
    element: <DetailPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"customer"} label="customer" />,
    },
  },
];
