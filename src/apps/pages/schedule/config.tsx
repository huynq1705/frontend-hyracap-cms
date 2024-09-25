import BreadCrumbLink from "@/components/BreadCrumbLink";
import { RouteExtends } from "@/types/types";
import SchedulePage from ".";

export const scheduleRouter: RouteExtends[] = [
    {
        path: "/schedule",
        canGuard: true,
        element: <SchedulePage />,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"schedule"} label="chedule" />,
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/schedule/create",
        canGuard: true,
        element: <SchedulePage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"schedule"} label="schedule" />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/schedule/view/:code",
        canGuard: true,
        element: <SchedulePage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"schedule"} label="schedule" />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/schedule/edit/:code",
        canGuard: true,
        element: <SchedulePage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"schedule"} label="schedule" />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
];
