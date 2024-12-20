import BreadCrumbLink from "@/components/BreadCrumbLink";
import WithdrawRequestPage from ".";

export const withdrawRequestRouter = [
    {
        path: "/withdrawRequest/view/:code",
        canGuard: true,
        element: <WithdrawRequestPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"withdrawRequest"}
                    label="label-withdrawRequest"
                />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/withdrawRequest",
        canGuard: true,
        element: <WithdrawRequestPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"withdrawRequest"}
                    label="label-withdrawRequest"
                />
            ),
            // roles: ["admin"],
        },
    },
];
