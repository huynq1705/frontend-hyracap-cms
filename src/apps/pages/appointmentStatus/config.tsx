import BreadCrumbLink from "@/components/BreadCrumbLink";
import Page from ".";

export const appointmentStatusRouter = [
  {
    path: "/status-schedule/create",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"status-schedule"} label="label-product" />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/status-schedule/view/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"status-schedule"} label="label-product" />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/status-schedule/edit/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"status-schedule"} label="label-product" />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/status-schedule",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"status-schedule"} label="label-product" />
      ),
      // roles: ["admin"],
    },
  },
];
