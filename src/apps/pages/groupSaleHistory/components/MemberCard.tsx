import palette from "@/theme/palette-common";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { Box, Grid, Stack } from "@mui/material";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export interface MemberCardProps {
    data?: any;
}

export default function MemberCard(props: MemberCardProps) {
    const { data } = props;
    const navigate = useNavigate();

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
            onClick={() => {
                navigate(`/admin/sale_history/${data?.members_staff_id}`);
            }}
        >
            <Stack
                direction={"column"}
                gap={1}
                sx={{
                    color: "var(--text-color-three)",
                    minWidth: "80px",
                }}
                className={clsx("px-2 py-1 w-fit h-fit cursor-pointer")}
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
                    {"Mã nhân viên : " + data?.members_staff_id}
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
                    {"Họ tên : " +
                        data?.members_first_name +
                        " " +
                        data?.members_last_name}
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
                    {"Chức vụ  : " + data?.staff_position}
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
                    {"Email : " + data?.members_email}
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
                    {"SĐT : " + data?.members_phone}
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
                    {"KPI : " + formatCurrency(+data?.kpi)}
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
                    {"Thưởng KPI : " + formatCurrency(+data?.kpi_bonus)}
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
                    {"Thưởng trực tiếp : " +
                        formatCurrency(+data?.direct_bonus)}
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
                    {"Doanh thu : " + formatCurrency(+data?.sales_revenue)}
                </Stack>
            </Stack>
        </Stack>
    );
}
