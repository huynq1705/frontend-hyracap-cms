import BreadCrumbLink from "@/components/BreadCrumbLink";
import GroupPage from ".";
import ViewPageV2 from "./component/viewPage";

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
        element: <ViewPageV2 />,
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
