import ActionButton from "@/components/button/action";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { ResponseProductItem } from "@/types/product";
import { formatCurrency } from "@/utils";
import { Box, Stack, Typography } from "@mui/material";
import { Pagination } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import SearchBoxTable from "@/components/search-box-table";
import { KeySearchType } from "@/types/types";
import StatusCard from "@/components/status-card";

export interface ITableResponsiveProps {
  dataConvert: ResponseProductItem[];
  className: string;
  page: {
    currentPage: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  hasPermission: any;
  actions: {
    openRemoveConfirm: (key_popup: string, code_item: string) => void;
    togglePopup: (
      params: "edit" | "remove" | "upload" | "create_category",
      value?: boolean
    ) => void;
  };
  keySearch: KeySearchType;
  setKeySearch: React.Dispatch<React.SetStateAction<KeySearchType>>;
  handleSearch: () => void;
}

export default function TableResponsive(props: ITableResponsiveProps) {
  const {
    dataConvert,
    className,
    page,
    hasPermission,
    actions,
    keySearch,
    setKeySearch,
    handleSearch,
  } = props;
  const { T } = useCustomTranslation();
  const navigate = useNavigate();

  return (
    <Box component={"div"} className={className}>
      <Box>
        <Box component={"div"} className="w-full">
          <SearchBoxTable
            keySearch={keySearch?.name__like ?? ""}
            setKeySearch={(value?: string) => {
              setKeySearch((prev) => ({
                ...prev,
                name__like: value || "",
              }));
            }}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên sản phẩm"
          />
        </Box>
        <Box component={"div"} className="flex flex-col gap-2 sm:flex-row sm:justify-between py-5">
          <StatusCard
            statusData={{
              name: "Tổng sản phẩm",
              total: page.totalItem,
              color: "#875BF7",
            }}
            customCss="true"
          />
          <StatusCard
            statusData={{
              name: "Tổng giá trị",
              total: page.totalItem,
              color: "#50945D",
            }}
            customCss="true"
          />
          <StatusCard
            statusData={{
              name: "Hàng tồn kho",
              total: page.totalItem,
              color: "#875BF7",
            }}
            customCss="true"
          />
        </Box>
      </Box>
      <Box component={"div"} className="flex flex-col gap-5">
        {dataConvert && dataConvert.length > 0 ? (
          dataConvert.map((item: ResponseProductItem, index: number) => {
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
                  <Typography fontSize={"12px"}>STT</Typography>
                  <Typography fontSize={"14px"}>{index + 1}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>Mã sản phẩm</Typography>
                  <Typography fontSize={"14px"}>{item?.id}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>{T("label-product")}</Typography>
                  <Typography fontSize={"14px"}>{item?.name ?? "Không có tên"}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>{T("brand")}</Typography>
                  <Typography fontSize={"14px"}>{item?.brand}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>{T("category")}</Typography>
                  <Typography fontSize={"14px"}>{item?.product_category?.name ?? "- -"}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>Loại sản phẩm</Typography>
                  <Typography fontSize={"14px"}>{item?.product_type?.name ?? "- -"}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>{T("purchase_rice")}</Typography>
                  <Typography fontSize={"14px"}>{formatCurrency(item?.original_price)}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>{T("selling_price")}</Typography>
                  <Typography fontSize={"14px"}>{formatCurrency(item?.selling_price)}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography fontSize={"12px"}>Số lượng còn lại</Typography>
                  <Typography fontSize={"14px"}>{item?.stock}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4 last:border-b-0"
                >
                  <Typography fontSize={"12px"}>{T("action")}</Typography>

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
                          navigate(`/admin/products/view/${item?.id}`);
                          actions.togglePopup("edit");
                        }}
                        className="flex items-center px-5 py-1 rounded hover:!bg-slate-400"
                      />
                    )}
                    {hasPermission.update && (
                      <ActionButton
                        type="edit"
                        onClick={() => {
                          navigate(`/admin/products/edit/${item?.id}`);
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
    </Box>
  );
}
