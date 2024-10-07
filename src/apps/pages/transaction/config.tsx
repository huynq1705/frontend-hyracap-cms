import BreadCrumbLink from "@/components/BreadCrumbLink";
import TransactionPage from ".";

export const transactionRouter = [
    {
        path: "/transaction/create",
        canGuard: true,
        element: <TransactionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"transaction"}
                    label="label-transaction"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/transaction/view/:code",
        canGuard: true,
        element: <TransactionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"transaction"}
                    label="label-transaction"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/transaction/edit/:code",
        canGuard: true,
        element: <TransactionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"transaction"}
                    label="label-transaction"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/transaction",
        canGuard: true,
        element: <TransactionPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"transaction"}
                    label="label-transaction"
                />
            ),
            // roles: ["admin"],
        },
    },
];
