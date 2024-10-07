import BreadCrumbLink from "@/components/BreadCrumbLink";
import ContractPage from ".";

export const contractRouter = [
    {
        path: "/contract/create",
        canGuard: true,
        element: <ContractPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"contract"} label="label-contract" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/contract/view/:code",
        canGuard: true,
        element: <ContractPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"contract"} label="label-contract" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/contract/edit/:code",
        canGuard: true,
        element: <ContractPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"contract"} label="label-contract" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/contract",
        canGuard: true,
        element: <ContractPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"contract"} label="label-contract" />
            ),
            // roles: ["admin"],
        },
    },
];
