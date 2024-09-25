import BreadCrumbLink from "@/components/BreadCrumbLink";
import Page from ".";

export const productRouter = [
  {
    path: "/products/create",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/products/view/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/products/edit/:code",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/products",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/products/add_category",
    canGuard: true,
    element: <Page />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
      // roles: ["admin"],
    },
  },
];
