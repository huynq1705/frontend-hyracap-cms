import BreadCrumbLink from "@/components/BreadCrumbLink";
import Page from ".";

export const prepaidCardFaceRouter = [
  {
    path: "/prepaid-card-face/create",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/prepaid-card-face/view/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/prepaid-card-face/edit/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/prepaid-card-face",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
];
