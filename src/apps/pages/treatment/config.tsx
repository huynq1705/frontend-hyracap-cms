import BreadCrumbLink from "@/components/BreadCrumbLink";
import TreatmentPage from ".";
import { RouteExtends } from "@/types/types";

export const treatmentRouter: RouteExtends[] = [
    {
        path: "/treatment",
        canGuard: true,
        element: <TreatmentPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"treatment"} label="treatment" />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/treatment/create",
        canGuard: true,
        element: <TreatmentPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"treatment"} label="treament" />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/treatment/view/:code",
        canGuard: true,
        element: <TreatmentPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"treatment"} label="treament" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/treatment/edit/:code",
        canGuard: true,
        element: <TreatmentPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"treatment"} label="treament" />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
];
