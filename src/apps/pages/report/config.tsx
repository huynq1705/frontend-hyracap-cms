import BreadCrumbLink from "@/components/BreadCrumbLink";
import ReportPage from ".";

export const reportRouter = [
    {
        path: "/report/create",
        canGuard: true,
        element: <ReportPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"report"} label="label-report" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/report/view/:code",
        canGuard: true,
        element: <ReportPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"report"} label="label-report" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/report/edit/:code",
        canGuard: true,
        element: <ReportPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"report"} label="label-report" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/report",
        canGuard: true,
        element: <ReportPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"report"} label="label-report" />
            ),
            // roles: ["admin"],
        },
    },
];
