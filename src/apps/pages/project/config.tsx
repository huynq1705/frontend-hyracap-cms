import BreadCrumbLink from "@/components/BreadCrumbLink";
import ProjectPage from ".";
import ProjectCreatePage from "./components/create";

export const projectRouter = [
    {
        path: "/project/create",
        canGuard: true,
        element: <ProjectCreatePage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"project"} label="label-project" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/project/view/:code",
        canGuard: true,
        element: <ProjectPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"project"} label="label-project" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/project/edit/:code",
        canGuard: true,
        element: <ProjectPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"project"} label="label-project" />
            ),
            // roles: ["admin"],
        },
    },
    {
        path: "/project",
        canGuard: true,
        element: <ProjectPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"project"} label="label-project" />
            ),
            // roles: ["admin"],
        },
    },
];
