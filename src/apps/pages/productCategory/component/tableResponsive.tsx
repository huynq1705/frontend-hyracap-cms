import ActionButton from "@/components/button/action";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { formatCurrency } from "@/utils";
import { Box, Stack, Typography } from "@mui/material";
import { Pagination, PaginationProps } from "antd";
import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { KeySearchType } from "@/types/types";
import SearchBoxTable from "./search-box-modal";
import MySelect from "@/components/input-custom-v2/select";
import CStatus from "@/components/status";
import { ResponseProductCategoryItem } from "@/types/productCategory";
import { handleGetPage } from "@/utils/filter";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";
import apiCommonService from "@/api/apiCommon.service";

export interface ITableResponsiveProps {
  dataConvert: any[];
  className: string;
  actions: {
    openRemoveConfirm: (key_popup: string, code_item: string) => void;
    togglePopup: (params: "edit" | "remove" | "upload") => void;
  };
  keySearch: KeySearchType;
  setKeySearch: React.Dispatch<React.SetStateAction<KeySearchType>>;
  handleSearch: () => void;
}

export default function TableResponsive(props: ITableResponsiveProps) {
  const {
    dataConvert,
    className,
    actions,
    keySearch,
    setKeySearch,
    handleSearch,
  } = props;
  const { T } = useCustomTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { exportData } = apiCommonService();
  const page = useSelector(selectPage);
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPage, pageSize } = handleGetPage(searchParams);

  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    // dispatch(setPage(pageNumber));
    // dispatch(setFlagSearch(true));
    searchParams.set("page", pageNumber.toString());
    setSearchParams(searchParams);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    // dispatch(setPageSize(pageSize));
    // dispatch(setFlagSearch(true));
    searchParams.set("take", pageSize.toString());
    setSearchParams(searchParams);
  };
  return (
    <Box component={"div"} className={className}>
      <Box component={"div"} className="flex flex-col gap-3 mb-4 items-end">
        <Box component={"div"} className="w-full">
          <SearchBoxTable
            keySearch={keySearch}
            setKeySearch={setKeySearch}
            handleSearch={handleSearch}
            customCss="true"
          />
        </Box>
        <Box component={"div"} className="w-full">
          <MySelect
            options={[
              { label: "Tất cả", value: "true;false" },
              { label: "Inactive", value: "false" },
              { label: "Active", value: "true" },
            ]}
            label={T("status")}
            errors={[]}
            required={[]}
            configUI={{
              width: "100%",
            }}
            name="status__in"
            placeholder="Chọn"
            handleChange={(e) => {
              const name = e?.target?.name;
              const value = e?.target?.value;
              const new_key_search = { ...keySearch };
              if (value && name) new_key_search[name] = [value];
              setKeySearch((prev) => ({ ...prev, [name]: [value] }));
            }}
            values={{ status__in: [keySearch.status__in] }}
            validate={{}}
            type="select-one"
            itemsPerPage={5}
            // inputStyle={{height:36}}
          />
        </Box>
      </Box>
      <Box component={"div"} className="flex flex-col gap-5">
        {dataConvert && dataConvert.length > 0 ? (
          dataConvert.map((item: any, index: number) => {
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
                  <Typography className="!font-bold" fontSize={"12px"}>
                    STT
                  </Typography>
                  <Typography fontSize={"14px"}>{index + 1}</Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography className="!font-bold" fontSize={"12px"}>
                    {T("product-category")}
                  </Typography>
                  <Typography fontSize={"14px"}>
                    {item?.name ?? "- -"}
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4"
                >
                  <Typography className="!font-bold" fontSize={"12px"}>
                    Trạng thái
                  </Typography>
                  <Stack direction={"column"} spacing={1} className="mt-2">
                    <CStatus
                      type={item?.status ? "success" : "error"}
                      name={item?.status ? "Active" : "Inactive"}
                    />
                  </Stack>
                </Box>
                <Box
                  component={"div"}
                  className="px-3 py-2 border-b border-solid border-x-0 border-t-0 border-gray-4 last:border-b-0"
                >
                  <Typography className="!font-bold" fontSize={"12px"}>
                    {T("action")}
                  </Typography>

                  <Stack
                    direction={"row"}
                    sx={{
                      gap: "12px",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {/* {hasPermission.update && ( */}
                    <ActionButton
                      type="view"
                      onClick={() => {
                        navigate(`/admin/product-category/view/${item?.id}`);
                        actions.togglePopup("edit");
                      }}
                      className="flex items-center px-5 py-1 rounded hover:!bg-slate-400"
                    />
                    {/* )} */}
                    {/* {hasPermission.delete && ( */}
                    <ActionButton
                      type="edit"
                      onClick={() => {
                        navigate(`/admin/product-category/edit/${item?.id}`);
                        actions.togglePopup("edit");
                      }}
                      className="flex items-center px-5 py-1 rounded hover:!bg-slate-400"
                    />
                    {/* )} */}
                    {/* {hasPermission.delete && ( */}
                    <ActionButton
                      type="remove"
                      onClick={() => {
                        actions.openRemoveConfirm("remove", `${item?.id}`);
                      }}
                      className="flex items-center px-5 py-1 rounded hover:!bg-slate-400"
                    />
                    {/* )} */}
                  </Stack>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box>No Data</Box>
        )}
        <Pagination
          className="bg-white max-lg::overflow-hidden"
          pageSize={pageSize}
          current={currentPage}
          showQuickJumper
          defaultCurrent={10}
          showSizeChanger
          locale={{
            items_per_page: "bản ghi/trang",
            jump_to: "Đến",
            page: "trang",
          }}
          onShowSizeChange={onShowSizeChange}
          total={page.totalItems}
          onChange={onChangePage}
          showTotal={(total, range) => {
            return `Hiển thị ${range[0]}-${range[1]} của ${total} mục`;
          }}
        />
      </Box>
    </Box>
  );
}
