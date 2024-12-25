import BreadCrumbLink from "@/components/BreadCrumbLink";
import { RouteExtends } from "@/types/types";
import BlogPage from ".";
import BlogCreatePage from "./detail";
import BlogDetailPage from "./detail/EditView";
// add new page : 1. cấu hình compoent render - tương úng với các đường dẫn
export const blogRouter: RouteExtends[] = [
  {
    path: "/blog",
    canGuard: true,
    element: <BlogPage />, // dùng popup thì tất các các path đều chung 1 compoent
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"blog"} label="blog" />,
      // roles: ["admin"],
      // permissions:["//.create"],
    },
  },
  {
    path: "/blog/create",
    canGuard: true,
    element: <BlogCreatePage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"blog/create"} label="blog" />,
      // roles: ["admin"],
      // permissions:["//.create"],
    },
  },
  {
    path: "/blog/view/:code",
    canGuard: true,
    element: <BlogDetailPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"blog"} label="blog" />,
      // roles: ["admin"],
    },
  },
  {
    path: "/blog/edit/:code",
    canGuard: true,
    element: <BlogDetailPage />,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"blog"} label="blog" />,
      // roles: ["admin"],
      // permissions:["//.create"],
    },
  },
];
