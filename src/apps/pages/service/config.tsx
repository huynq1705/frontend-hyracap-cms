import BreadCrumbLink from "@/components/BreadCrumbLink";
import ServicePage from ".";
import ListServiceCatalog from "./components/ListServiceCatalog";

export const serviceRouter = [
  {
    path: "/service-list",
    element: <ServicePage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"service"} label="label-product" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/service-list/add_category",
    element: <ServicePage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"add"} label="label-product" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/service-list/create",
    element: <ServicePage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"service"} label="label-product" />,
      // roles: ["admin"],
    },
  },

  {
    path: "/service-catalog",
    element: <ListServiceCatalog />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"service"} label="label-product" />,
      // roles: ["admin"],
    },
  },

  {
    path: "/service-catalog/create",
    element: <ListServiceCatalog />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"service"} label="label-product" />,
      // roles: ["admin"],
    },
  },
 

];
