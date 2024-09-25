import BreadCrumbLink from "@/components/BreadCrumbLink";
import BankPage from ".";

export const serviceBank = [
    {
        path: "/bank",
        element: <BankPage />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },

];
