import BreadCrumbLink from "@/components/BreadCrumbLink";
import Page from ".";

export const prepaidCardFaceValueRouter = [
  {
    path: "/prepaid-card-face-value/create",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face-value"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/prepaid-card-face-value/view/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face-value"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/prepaid-card-face-value/edit/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face-value"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/prepaid-card-face-value",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face-value"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
];
