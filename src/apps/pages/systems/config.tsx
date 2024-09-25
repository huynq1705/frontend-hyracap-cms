import BreadCrumbLink from "@/components/BreadCrumbLink";
import PaymentPage from "../payment";
import CustomerSource from "../customer-source";
import EvaluationPage from "../evaluations";
import SettingPage from "../system-setting/components/Setting";
import SystemsPage from ".";
import SettingSystemsPage from "../system-setting/components/Setting";
import CTablePosition from "./components/CTablePosition";
import { serviceCompany } from "../company/config";

export const systemsRouter = [
    {
        path: "/systems-position-list",
        element: <CTablePosition />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },

    ////////////////////////////////////////
    {
        path: "/systems-position",
        element: <SystemsPage />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },

    {
        path: "/systems-position/create",
        element: <SystemsPage />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },
    {
        path: "/systems-position/view/:code",
        element: <SystemsPage />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },
    {
        path: "/systems-position/edit/:code",
        element: <SystemsPage />,
        canGuard: true,
        handle: {
            crumb: () => <BreadCrumbLink linkTo={"products"} label="label-product" />,
            // roles: ["admin"],
        },
    },

    {
        path: "/systems-payment",
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
        path: "/systems-payment/create",
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
        path: "/systems-payment/view",
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
        path: "/systems-payment/edit",
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
        path: "/systems-customer",
        canGuard: true,
        element: <CustomerSource />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },
    {
        path: "/systems-customer/create",
        canGuard: true,
        element: <CustomerSource />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },
    {
        path: "/systems-setting",
        canGuard: true,
        element: <SettingSystemsPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },
    
    ...serviceCompany
];
