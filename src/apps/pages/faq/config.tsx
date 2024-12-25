import BreadCrumbLink from "@/components/BreadCrumbLink";
import FaqPage from ".";

export const faqRouter = [
  {
    path: "/faq",
    canGuard: true,
    element: <FaqPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"faq"} label="label-faq" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/faq/view/:code",
    canGuard: true,
    element: <FaqPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"faq"} label="label-faq" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/faq/edit/:code",
    canGuard: true,
    element: <FaqPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"faq"} label="label-faq" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/faq/create",
    canGuard: true,
    element: <FaqPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"faq"} label="label-faq" />,
      // roles: ["admin"],
    },
  },
];
