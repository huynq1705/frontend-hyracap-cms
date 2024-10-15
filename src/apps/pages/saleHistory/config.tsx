import BreadCrumbLink from "@/components/BreadCrumbLink";
import SaleHistoryPage from ".";

export const saleHistoryRouter = [
    {
        path: "/sale_history/view/:code",
        canGuard: true,
        element: <SaleHistoryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"sale_history"}
                    label="label-sale_history"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/sale_history",
        canGuard: true,
        element: <SaleHistoryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"sale_history"}
                    label="label-sale_history"
                />
            ),
            // roles: ["admin"],
        },
    },
];
