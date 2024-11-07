import BreadCrumbLink from "@/components/BreadCrumbLink";
import IndustryPage from ".";

export const industryRouter = [
    {
        path: "/industry/create",
        canGuard: true,
        element: <IndustryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"industry"} label="label-industry" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/industry/view/:code",
        canGuard: true,
        element: <IndustryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"industry"} label="label-industry" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/industry/edit/:code",
        canGuard: true,
        element: <IndustryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"industry"} label="label-industry" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/industry",
        canGuard: true,
        element: <IndustryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"industry"} label="label-industry" />
            ),
            // roles: ["admin"],
        },
    },
];
