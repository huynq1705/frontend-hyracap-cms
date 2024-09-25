import BreadCrumbLink from "@/components/BreadCrumbLink";
import ReportPage from ".";
import ReportRevenuePage from "./revenue";
import DetailsPage from "./revenue/detail";
import ReportProductPage from "./product";
import ReportCommissionPage from "./commission";
import ReportCustomerPage from "./customer";
import ReportServicePage from "./service";
import CommissionDetailPage from "./commission/detail";
import CriterionPage from "./customer/criterion";
import EmployeePage from "./customer/employee";

export const reportRouter = [
  {
    path: "/report-revenue",
    element: <ReportRevenuePage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report-service",
    element: <ReportServicePage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report-product",
    element: <ReportProductPage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report-commission",
    element: <ReportCommissionPage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report-customer",
    element: <ReportCustomerPage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report/:page",
    element: <DetailsPage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report-commission/detail/:code",
    element: <CommissionDetailPage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report-customer/employee/:code",
    element: <EmployeePage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
  {
    path: "/report-customer/criterion/:code",
    element: <CriterionPage />,
    canGuard: true,
    handle: {
      crumb: () => <BreadCrumbLink linkTo={"404"} />,
    },
  },
];
