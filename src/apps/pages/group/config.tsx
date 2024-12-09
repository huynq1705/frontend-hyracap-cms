import BreadCrumbLink from "@/components/BreadCrumbLink";
import GroupPage from ".";

export const groupRouter = [
    {
        path: "/group/create",
        canGuard: true,
        element: <GroupPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"group"} label="label-group" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/group/view/:code",
        canGuard: true,
        element: <GroupPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"group"} label="label-group" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/group/edit/:code",
        canGuard: true,
        element: <GroupPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"group"} label="label-group" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/group",
        canGuard: true,
        element: <GroupPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"group"} label="label-group" />
            ),
            // roles: ["admin"],
        },
    },
];
