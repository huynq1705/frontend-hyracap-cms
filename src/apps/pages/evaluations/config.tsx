import BreadCrumbLink from "@/components/BreadCrumbLink";
import EvaluationPage from "../evaluations";
import CTableEvaluationCustomer from "./components/CTableFromCustomer";

export const systemsEvaluation = [

    {
        path: "/evaluation-customer",
        canGuard: true,
        element: <CTableEvaluationCustomer />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },
    {
        path: "/systems-evaluation",
        canGuard: true,
        element: <EvaluationPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },
    {
        path: "/systems-evaluation/create",
        canGuard: true,
        element: <EvaluationPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"payment"} label="label-payment" />
            ),
            // roles: ["admin"],
            // permissions: ["customer.getList", "customer.getDetail"],
        },
    },



]
