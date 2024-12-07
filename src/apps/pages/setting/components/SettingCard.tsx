import palette from "@/theme/palette-common";
import { formatDate } from "@/utils/date-time";
import { Box, Grid, Stack } from "@mui/material";
import clsx from "clsx";

export interface SettingCardProps {
    data?: any;
}
const months = [
    { name: "Tháng 1", key: "jan_rate" },
    { name: "Tháng 2", key: "feb_rate" },
    { name: "Tháng 3", key: "mar_rate" },
    { name: "Tháng 4", key: "apr_rate" },
    { name: "Tháng 5", key: "may_rate" },
    { name: "Tháng 6", key: "jun_rate" },
    { name: "Tháng 7", key: "jul_rate" },
    { name: "Tháng 8", key: "aug_rate" },
    { name: "Tháng 9", key: "sep_rate" },
    { name: "Tháng 10", key: "oct_rate" },
    { name: "Tháng 11", key: "nov_rate" },
    { name: "Tháng 12", key: "dec_rate" },
];

export default function SettingCard(props: SettingCardProps) {
    const { data } = props;
    console.log("data", data);
    return (
        <Stack
            direction={"row"}
            spacing={"6px"}
            alignItems={"center"}
            borderRadius={4}
            p={1}
            bgcolor={palette.bgPrimary}
            sx={{
                width: "fit-content",
            }}
        >
            <Stack
                direction={"column"}
                gap={1}
                sx={{
                    color: "var(--text-color-three)",
                    minWidth: "80px",
                }}
                className={clsx("px-2 py-1 w-fit h-fit ")}
            >
                <Stack
                    direction={"row"}
                    gap={1}
                    className={clsx("items-center text-xs capitalize ")}
                >
                    <Box
                        className="w-2 h-2 rounded-full"
                        sx={{
                            backgroundColor: "var(--success-color)",
                        }}
                    ></Box>
                    {"Áp dụng từ : " +
                        formatDate(data?.effective_from, "DDMMYY")}
                </Stack>
                <Stack
                    direction={"row"}
                    gap={1}
                    className={clsx("items-center text-xs capitalize ")}
                >
                    <Box
                        className="w-2 h-2 rounded-full"
                        sx={{
                            backgroundColor: "var(--success-color)",
                        }}
                    ></Box>
                    {"% Thưởng trực tiếp: " +
                        (Number(data?.direct_bonus_min_percent) * 100).toFixed(
                            2
                        ) +
                        " %"}
                </Stack>
                <Stack
                    direction={"row"}
                    gap={1}
                    className={clsx("items-center text-xs capitalize ")}
                >
                    <Box
                        className="w-2 h-2 rounded-full"
                        sx={{
                            backgroundColor: "var(--success-color)",
                        }}
                    ></Box>
                    {"Thưởng vượt KPI : " +
                        (Number(data?.kpi_bonus_min_percent) * 100).toFixed(2) +
                        " %" +
                        " - " +
                        (Number(data?.kpi_bonus_max_percent) * 100).toFixed(2) +
                        " %"}
                </Stack>
                <Stack
                    direction={"row"}
                    gap={1}
                    className={clsx("items-center text-xs capitalize ")}
                >
                    <Box
                        className="w-2 h-2 rounded-full"
                        sx={{
                            backgroundColor: "var(--success-color)",
                        }}
                    ></Box>
                    {"KPI theo từng tháng:"}
                </Stack>
                <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 4 }}
                >
                    {months.map((month, index) => (
                        <Grid item xs={4} md={3} key={month.key}>
                            {month.name}:{" "}
                            {Number(data.monthly_rates[index]).toFixed(2) +
                                " %"}
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Stack>
    );
}
