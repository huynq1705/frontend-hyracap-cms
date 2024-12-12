import BreadCrumbLink from "@/components/BreadCrumbLink";
// import EditPage from "./edit";
// import NavigateRoute from "@/routers/NavigateRoute";
// import ListServiceCatalog from "./components/ListServiceCatalog";
// import EditCatalogPage from "./edit/EditCatalog";
import AdminPage from ".";

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
        element: <AdminPage />,
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
