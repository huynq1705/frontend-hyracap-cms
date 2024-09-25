import BreadCrumbLink from "@/components/BreadCrumbLink";
import AdminPage from "../admin";
import ManagementEmployeePage from "../management/components/ManagementEmployee";

export const managementRouter = [
  {
    path: "/management-employee",
    canGuard: true,
    element: <ManagementEmployeePage />,
    handle: {
      crumb: () => (
        <BreadCrumbLink
          linkTo={"prepaid-card-face-value"}
          label="label-product"
        />
      ),
      // roles: ["admin"],
    },
  },
  // {
  //     path: "/management-employee-detail",
  //     canGuard: true,
  //     element: <ManagementEmployeePage />,
  //     handle: {
  //         crumb: () => (
  //             <BreadCrumbLink
  //                 linkTo={"prepaid-card-face-value"}
  //                 label="label-product"
  //             />
  //         ),
  //         // roles: ["admin"],
  //     },
  // },
];
