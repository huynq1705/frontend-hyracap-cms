import palette from "@/theme/palette-common";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { Box, Grid, Stack } from "@mui/material";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export interface ContractCartProps {
    data?: any;
}

export default function ContractCart(props: ContractCartProps) {
    const { data } = props;
    const navigate = useNavigate();
    return (
        <Stack
            direction={"row"}
            spacing={"6px"}
            alignItems={"center"}
            borderRadius={4}
            p={1}
            bgcolor={palette.bgPrimary}
            sx={{
                width: "100%",
            }}
            onClick={() => {
                navigate(`/admin/contract/view/${data?.id}`);
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
                    {"Hợp đồng số : " + data?.contract_id}
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
                    {"Sản phẩm : " + data?.product?.name}
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
                    {"Số tiền đầu tư : " + data?.capital}
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
                    {"Kỳ hạn : " + data?.duration + " tháng"}
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
                    {"Lợi nhuận ước tính : " +
                        formatCurrency(+data?.provisional_profit)}
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
                    {"Lợi nhuận hiện tại : " +
                        formatCurrency(+data?.current_profit)}
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
                    {"Lợi nhuậ trước thuế : " +
                        formatCurrency(+data?.profit_before_tax)}
                </Stack>
            </Stack>
        </Stack>
    );
}
