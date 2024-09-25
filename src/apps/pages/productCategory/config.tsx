import BreadCrumbLink from "@/components/BreadCrumbLink";
import ProductCategoryPage from ".";
import { RouteExtends } from "@/types/types";

export const productCategoryRouter: RouteExtends[] = [
  {
    path: "/product-category",
    canGuard: true,
    element: <ProductCategoryPage />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"product-category"} label="product_category" />
      ),
      // roles: ["admin"],
      // permissions:["//.create"],
    },
  },
  {
    path: "/product-category/create",
    canGuard: true,
    element: <ProductCategoryPage />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"product-category"} label="product_category" />
      ),
      // roles: ["admin"],
      // permissions:["//.create"],
    },
  },
  {
    path: "/product-category/view/:code",
    canGuard: true,
    element: <ProductCategoryPage />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"product-category"} label="product_category" />
      ),
      // roles: ["admin"],
    },
  },
  {
    path: "/product-category/edit/:code",
    canGuard: true,
    element: <ProductCategoryPage />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"product-category"} label="product_category" />
      ),
      // roles: ["admin"],
      // permissions:["//.create"],
    },
  },
];
