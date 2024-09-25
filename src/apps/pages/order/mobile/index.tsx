import ActionButton from "@/components/button/action";
import CTooltip from "@/components/CTooltip";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import usePermissionCheck from "@/hooks/usePermission";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { Box, Stack, Typography } from "@mui/material";
import { Tooltip } from "antd";
import clsx from "clsx";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export interface CTableMobileProps {
  dataSource: any[];
  actions: {
    openRemoveConfirm: (key_popup: string, code_item: string) => void;
    togglePopup: (params: "edit" | "remove" | "upload") => void;
  };
}

export default function CTableMobile(props: CTableMobileProps) {
  const { dataSource, actions } = props;
  const { T } = useCustomTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissionCheck("order");

  return (
    <div className={clsx(window.innerWidth > 768 && "!hidden")}>
      <Box component={"div"} className="flex flex-col gap-5">
        {dataSource && dataSource.length > 0 ? (
          dataSource.map((item: any, index: number) => {
            return (
              <Box
                key={item?.id}
                component={"div"}
                className="flex flex-col shadow border border-solid border-gray-4 rounded"
              >
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    STT
                  </Typography>
                  <Typography fontSize={"14px"}>{index + 1}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Mã đơn hàng
                  </Typography>
                  <Typography fontSize={"14px"}>{item?.id}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Tên khách hàng
                  </Typography>
                  <Typography fontSize={"14px"}>
                    <CTooltip text={item?.customer?.full_name ?? "Khách lẻ"} />
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Số điện thoại
                  </Typography>
                  <Typography fontSize={"14px"}>
                    {item?.customer?.phone_number ?? "- -"}
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Thời gian
                  </Typography>
                  <Typography fontSize={"14px"}>
                    {formatDate(item?.created_at, "DDMMYYYYvsHHMM")}
                  </Typography>
                </Box>

                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Nhân viên thực hiện
                  </Typography>
                  <Typography fontSize={"14px"}>
                    <CTooltip
                      text={
                        item?.order_detail &&
                        item.order_detail
                          .map(
                            (x: any) => x?.account_order[0]?.account?.full_name,
                          )
                          .join(",")
                      }
                    />
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Số tiền thanh toán
                  </Typography>
                  <Typography fontSize={"14px"}>
                    {formatCurrency(item?.paid)}
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Đơn giá
                  </Typography>
                  <Typography fontSize={"14px"}>
                    {formatCurrency(item?.provisional)}
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    VAT
                  </Typography>
                  <Typography fontSize={"14px"}>{item?.VAT} %</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    Tổng tiền hóa đơn
                  </Typography>
                  <Typography fontSize={"14px"}>
                    {formatCurrency(item?.total)}
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4 last:border-b-0"
                >
                  <Typography fontSize={"12px"} className="!font-bold">
                    {T("action")}
                  </Typography>

                  <Stack
                    direction={"row"}
                    sx={{
                      gap: "20px",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {hasPermission.getDetail && (
                      <ActionButton
                        type="view"
                        onClick={() => {
                          navigate(`/admin/order/view/${item?.id}`);
                          actions.togglePopup("edit");
                        }}
                        className="flex items-center px-5 py-1 rounded hover:!bg-slate-400"
                      />
                    )}
                    {hasPermission.update && (
                      <ActionButton
                        type="edit"
                        onClick={() => {
                          navigate(`/admin/order/edit/${item?.id}`);
                          actions.togglePopup("edit");
                        }}
                        className="flex items-center px-5 py-1 rounded hover:!bg-slate-400"
                      />
                    )}
                    {hasPermission.delete && (
                      <ActionButton
                        type="remove"
                        onClick={() => {
                          actions.openRemoveConfirm("remove", `${item?.id}`);
                        }}
                        className="flex items-center px-5 py-1 rounded hover:!bg-slate-400"
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box>No Data</Box>
        )}
      </Box>
    </div>
  );
}
