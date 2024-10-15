import BreadCrumbLink from "@/components/BreadCrumbLink";
import PositionPage from ".";

export const positionRouter = [
    {
        path: "/position/create",
        canGuard: true,
        element: <PositionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"position"} label="label-position" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/position/view/:code",
        canGuard: true,
        element: <PositionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"position"} label="label-position" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/position/edit/:code",
        canGuard: true,
        element: <PositionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"position"} label="label-position" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/position",
        canGuard: true,
        element: <PositionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"position"} label="label-position" />
            ),
            // roles: ["admin"],
        },
    },
];
