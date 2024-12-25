import BreadCrumbLink from "@/components/BreadCrumbLink";
import ContactPage from ".";

export const contactRouter = [
  {
    path: "/contact",
    canGuard: true,
    element: <ContactPage />,
    handle: {
      crumb: () => (
        <BreadCrumbLink linkTo={"contract"} label="label-contract" />
      ),
      // roles: ["admin"],
    },
  },
];
