import BreadCrumbLink from "@/components/BreadCrumbLink";
import ConfigSchedulePage from ".";

export const configScheduleRouter = [
    {
        path: "/config-schedule",
        canGuard: true,
        element: <ConfigSchedulePage />,
        handle: {
            crumb: () => (
                <BreadCrumbLink
                    linkTo={"config-schedule"}
                    label="config-schedule"
                />
            ),
            role: ["admin"],
        },
    },
];
