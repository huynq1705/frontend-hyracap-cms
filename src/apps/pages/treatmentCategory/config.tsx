import BreadCrumbLink from "@/components/BreadCrumbLink";
import { RouteExtends } from "@/types/types";
import TreatmentOrderPage from ".";

export const treatmentOrderRouter: RouteExtends[] = [
    {
        path: "/order-detail-information/treatment",
        canGuard: true,
        element: <TreatmentOrderPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"treatment-order"}
                    label="treatment-order"
                />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/order-detail-information/treatment/create",
        canGuard: true,
        element: <TreatmentOrderPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"treatment-order"}
                    label="treatment-order"
                />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
    {
        path: "/order-detail-information/treatment/view/:code",
        canGuard: true,
        element: <TreatmentOrderPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"treatment-order"}
                    label="treatment-order"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/order-detail-information/treatment/edit/:code",
        canGuard: true,
        element: <TreatmentOrderPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"treatment-order"}
                    label="treatment-order"
                />
            ),
            // roles: ["admin"],
            // permissions:["//.create"],
        },
    },
];
