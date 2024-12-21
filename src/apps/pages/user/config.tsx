import BreadCrumbLink from "@/components/BreadCrumbLink";
import AdminPage from ".";
import ViewPage from "./components/PageAdmin";

export const adminRouter = [
    {
        path: "/users",
        canGuard: true,
        element: <AdminPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"users"} label="Create-users" />
            ),
            role: ["admin"],
        },
    },
    {
        path: "/users/create",
        canGuard: true,
        element: <AdminPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"users"} label="Create-users" />
            ),
            role: ["admin"],
        },
    },
    {
        path: "/users/view/:code",
        canGuard: true,
        element: <ViewPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"users"} label="Create-users" />
            ),
            role: ["admin"],
        },
    },
    {
        path: "/users/edit/:code",
        canGuard: true,
        element: <AdminPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"users"} label="Create-users" />
            ),
            role: ["admin"],
        },
    },
];
