import BreadCrumbLink from "@/components/BreadCrumbLink";
import PaymentPage from ".";
import { RouteExtends } from "@/types/types";

export const paymentRouter: RouteExtends[] = [
    {
        path: "/payment",
        canGuard: true,
        element: <PaymentPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },
    {
        path: "/payment/create",
        canGuard: true,
        element: <PaymentPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },
];
