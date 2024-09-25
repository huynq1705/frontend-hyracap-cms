import BreadCrumbLink from "@/components/BreadCrumbLink";
import ServicePage from ".";
// import EditPage from "./edit";
// import NavigateRoute from "@/routers/NavigateRoute";
// import ListServiceCatalog from "./components/ListServiceCatalog";
// import EditCatalogPage from "./edit/EditCatalog";
import AdminPage from ".";


export const adminRouter = [
    {
        path: "/admin-list/create",
        canGuard: true,
        element: <AdminPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"admin"} label="Create-admin" />
            ),
            role: ["admin"]
        },
    },

    // {
    //     path: "/admin-list/edit/:code",
    //     canGuard: true,
    //     element: <AdminPage />,
    //     handle: {
    //         crumb: () => (
    //             <BreadCrumbLink linkTo={"admin"} label="Edit-admin" />
    //         ),
    //         role: ["admin"]
    //     },
   
    // },
    // {
    //     path: "/admin-catalog/create",
    //     canGuard: true,
    //     element: <EditCatalogPage />,
    //     handle: {
    //         crumb: () => (
    //             <BreadCrumbLink linkTo={"admin"} label="Create-catalog" />
    //         ),
    //         role: ["admin"]
    //     },
    // },

    // {
    //     path: "/admin-catalog/edit/:code",
    //     canGuard: true,
    //     element: <EditCatalogPage />,
    //     handle: {
    //         crumb: () => (
    //             <BreadCrumbLink linkTo={"admin"} label="Edit-catalog" />
    //         ),
    //         role: ["admin"]
    //     },

    // },
    // {
    //     path: "",
    //     canGuard: true,
    //     children: [
    //         {
    //             path: "admin-list",
    //             index: true,
    //             element: <AdminPage />,
    //             canGuard: true,
    //             role: ["admin"]
    //         },
    //         {
    //             path: "admin-catalog",
    //             index: true,
    //             element: <ListServiceCatalog />,
    //             canGuard: true, 
    //             role: ["admin"]

    //         },
    //     ],
    //     handle: {
    //         crumb: () => (
    //             <BreadCrumbLink
    //                 linkTo={"admin-list"}
    //                 label="Admin"
                    
    //             />
    //         ),
    //         role: ["admin"]

    //     },
    // },
];
