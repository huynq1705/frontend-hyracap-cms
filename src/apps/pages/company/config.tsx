import BreadCrumbLink from "@/components/BreadCrumbLink";
import PageCompany from ".";

export const serviceCompany = [
    {
        path: "/company",
        element: <PageCompany />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },

];
