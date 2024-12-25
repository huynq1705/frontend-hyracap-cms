import BreadCrumbLink from "@/components/BreadCrumbLink";
import { RouteExtends } from "@/types/types";
import ManualPage from ".";
import ManualCreatePage from "./detail";
import ManualDetailPage from "./detail/EditView";
// add new page : 1. cấu hình compoent render - tương úng với các đường dẫn
export const manualRouter: RouteExtends[] = [
    {
        path: "/manual",
        canGuard: true,
        element: <ManualPage />, // dùng popup thì tất các các path đều chung 1 compoent
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"manual"} label="manual" />,
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/manual/create",
        canGuard: true,
        element: <ManualCreatePage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"manual/create"} label="manual" />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/manual/view/:code",
        canGuard: true,
        element: <ManualDetailPage />,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"manual"} label="manual" />,
            // roles: ["admin"],
        },
    },
    {
        path: "/manual/edit/:code",
        canGuard: true,
        element: <ManualDetailPage />,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"manual"} label="manual" />,
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
];
