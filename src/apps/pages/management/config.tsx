import BreadCrumbLink from "@/components/BreadCrumbLink";
import ManagementEmployeePage from "./components/ManagementEmployee";
import AdminPage from "../admin";
import EditPage from "../employee/components/EditPage";

export const managementRouter = [
  {
    path: "/management-admin",
    canGuard: true,
    element: <AdminPage />,
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
  {
    path: "/management-admin/create",
    canGuard: true,
    element: <AdminPage />,
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
  {
    path: "/management-employee/create",
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
  {
    path: "/management-employee/detail/:code/:name/:star",
    canGuard: true,
    element: <EditPage />,
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
  {
    path: "/management-employee/edit/:code/:name/:star",
    canGuard: true,
    element: <EditPage />,
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
  //   path: "/management-employee-detail/:code/",
  //   canGuard: true,
  //   element: <EditPage />,
  //   handle: {
  //     crumb: () => (
  //       <BreadCrumbLink
  //         linkTo={"prepaid_card_face_value"}
  //         label="label-product"
  //       />
  //     ),
  //     // roles: ["admin"],
  //   },
  // },
];
