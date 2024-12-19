import BreadCrumbLink from "@/components/BreadCrumbLink";
import GroupSaleHistoryPage from ".";
import ViewPageV2 from "./components/viewPage";

export const groupSaleHistoryRouter = [
    {
        path: "/group_sale_history/view/:code",
        canGuard: true,
        element: <ViewPageV2 />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"group_sale_history"}
                    label="label-group_sale_history"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/group_sale_history",
        canGuard: true,
        element: <GroupSaleHistoryPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"group_sale_history"}
                    label="label-group_sale_history"
                />
            ),
            // roles: ["admin"],
        },
    },
];
