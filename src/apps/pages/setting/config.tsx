import BreadCrumbLink from "@/components/BreadCrumbLink";
import SettingPage from ".";

export const settingRouter = [
    {
        path: "/setting",
        canGuard: true,
        element: <SettingPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"setting"} label="Create-setting" />
            ),
            role: ["admin"],
        },
    },
    {
        path: "/setting/create",
        canGuard: true,
        element: <SettingPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"setting"} label="Create-setting" />
            ),
            role: ["admin"],
        },
    },
    {
        path: "/setting/view:code",
        canGuard: true,
        element: <SettingPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"setting"} label="Create-setting" />
            ),
            role: ["admin"],
        },
    },
    {
        path: "/setting/edit:code",
        canGuard: true,
        element: <SettingPage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink linkTo={"setting"} label="Create-setting" />
            ),
            role: ["admin"],
        },
    },
];
