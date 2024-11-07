import BreadCrumbLink from "@/components/BreadCrumbLink";
import { RouteExtends } from "@/types/types";
import BlogCategoryPage from ".";
// add new page : 1. cấu hình compoent render - tương úng với các đường dẫn
export const blogCategoryRouter: RouteExtends[] = [
    {
        path: "/blog_category",
        canGuard: true,
        element: <BlogCategoryPage />, // dùng popup thì tất các các path đều chung 1 compoent
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"blog_category"}
                    label="blog_category"
                />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/blog_category/create",
        canGuard: true,
        element: <BlogCategoryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"blog_category"}
                    label="blog_category"
                />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/blog_category/view/:code",
        canGuard: true,
        element: <BlogCategoryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"blog_category"}
                    label="blog_category"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/blog_category/edit/:code",
        canGuard: true,
        element: <BlogCategoryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"blog_category"}
                    label="blog_category"
                />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
];
