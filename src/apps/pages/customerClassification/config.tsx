import BreadCrumbLink from "@/components/BreadCrumbLink";
import CustomerClassificationPage from ".";

export const customerClassificationRouter = [
    {
        path: "/customer-classification",
        canGuard: true,
        element: <CustomerClassificationPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"customer-classification"}
                    label="customer_classification"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/customer-classification/create",
        canGuard: true,
        element: <CustomerClassificationPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"customer-classification"}
                    label="customer_classification"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/customer-classification/view/:code",
        canGuard: true,
        element: <CustomerClassificationPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"customer-classification"}
                    label="customer_classification"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/customer-classification/edit/:code",
        canGuard: true,
        element: <CustomerClassificationPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"customer-classification"}
                    label="customer_classification"
                />
            ),
            // roles: ["admin"],
        },
    },
];
