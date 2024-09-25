import BreadCrumbLink from "@/components/BreadCrumbLink";
import ServicePage from ".";
import MediaPage from ".";

export const serviceMedia = [
    {
        path: "/media",
        element: <MediaPage />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },
   
];
