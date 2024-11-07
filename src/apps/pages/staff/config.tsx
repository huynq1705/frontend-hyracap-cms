import BreadCrumbLink from "@/components/BreadCrumbLink";
import StaffPage from ".";

export const staffRouter = [
    {
        path: "/staff",
        canGuard: true,
        element: <StaffPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"staff"} label="Create-staff" />
            ),
            // role: ["admin"],
        },
    },
    {
        path: "/staff/create",
        canGuard: true,
        element: <StaffPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"staff"} label="Create-staff" />
            ),
            // role: ["admin"],
        },
    },
    {
        path: "/staff/view/:code",
        canGuard: true,
        element: <StaffPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"staff"} label="Create-staff" />
            ),
            // role: ["admin"],
        },
    },
    {
        path: "/staff/edit/:code",
        canGuard: true,
        element: <StaffPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"staff"} label="Create-staff" />
            ),
            // role: ["admin"],
        },
    },
];
