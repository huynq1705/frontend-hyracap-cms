import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import PopupConfirmImport from "@/components/popup/confirm-import";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { formatCurrency } from "@/utils";
import usePermissionCheck from "@/hooks/usePermission";
import SearchBoxTable from "./search-box-table";
import ActionButton from "@/components/button/action";
import ModalEdit from "./ModalEdit";
import apiProductService from "@/api/apiProduct.service";
import { convertObjToParam, parseQueryParams } from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import apiAppointmentStatusService from "@/api/apiAppointmentStatus.service";
import EmptyIcon from "@/components/icons/empty";
interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
}

const getColumns = (props: ColumnProps) => {
  const navigate = useNavigate();
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  //permissions
  const { hasPermission } = usePermissionCheck("product");

  const { actions } = props;
  const columns: any = [
    {
      title: "STT",
      dataIndex: "product",

      render: (_: any, item: any, index: number) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "center",
            }}
          >
            {index + 1}
          </Typography>
        </Stack>
      ),
      width: 50,
    },
    {
      title: "Mã trạng thái",
      dataIndex: "appointment-status",

      render: (_: any, item: any, index: number) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "center",
            }}
          >
            {item?.id}
          </Typography>
        </Stack>
      ),
      width: 100,
    },
    {
      title: T("status-schedule"),
      dataIndex: "appointment-status",
      fixed: "left" as const,
      render: (_: any, item: any) => (
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"flex-start"}
          sx={{
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate(`${pathname}/edit/${item?.sh_code}`)}
        >
          {/* <Avatar
            alt="Customer Image"
            src={
              !item?.gender
                ? "src/assets/icons/user_men.svg"
                : "src/assets/icons/user-women.svg"
            }
            style={{ marginTop: "5px" }}
          /> */}
          <Stack direction={"column"}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-color-primary)",
              }}
            >
              {item?.name ?? "Không có tên"}
            </Typography>
            <Typography
              style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "var(--text-color-secondary)",
              }}
            >
              {item?.sh_code}
            </Typography>
          </Stack>
        </Stack>
      ),
      width: 220,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      render: (_: any, item: any) => (
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"flex-start"}
          sx={{
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate(`${pathname}/edit/${item?.sh_code}`)}
        >
          <Stack direction={"row"} gap={"24px"}>
            <div
              className="h-7 rounded-2xl relative overflow-hidden w-28"
              style={{
                border: `1px solid ${item?.color}`,
              }}
            >
              <div
                className="absolute top-0 right-0 left-0 bottom-0 z-5 opacity-10"
                style={{
                  background: item?.color ?? "transparent",
                }}
              ></div>
              <Stack
                direction={"row"}
                className="absolute top-0 right-0 left-0 bottom-0 z-10 transparent text-sm flex items-center  gap-2 px-2"
                sx={{
                  color: item?.color ?? "black",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: item?.color ?? "transparent",
                  }}
                ></div>
                <p className="flex-grow-1">{item?.color ?? "- -"}</p>
              </Stack>
            </div>
          </Stack>
        </Stack>
      ),
      width: 80,
    },
  ];
  {
    (hasPermission.update || hasPermission.delete) &&
      columns.push({
        title: T("action"),
        width: 100,
        dataIndex: "actions",
        fixed: "right" as const,
        render: (_: any, d: any) => (
          <>
            {/* check permission */}
            {true && (
              <Stack
                direction={"row"}
                sx={{
                  gap: "12px",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {hasPermission.getDetail && (
                  <ActionButton
                    type="view"
                    onClick={() => {
                      navigate(`/status-schedule/view/${d?.id}`);
                      actions.togglePopup("edit");
                    }}
                  />
                )}
                {hasPermission.update && (
                  <ActionButton
                    type="edit"
                    onClick={() => {
                      navigate(`/status-schedule/edit/${d?.id}`);
                      actions.togglePopup("edit");
                    }}
                  />
                )}
                {hasPermission.delete && (
                  <ActionButton
                    type="remove"
                    onClick={() => {
                      actions.openRemoveConfirm("remove", d?.id);
                    }}
                  />
                )}
              </Stack>
            )}
          </>
        ),
      });
  }
  return columns;
};

interface CTableProps {
  authorizedPermissions?: any;
}

const CTable = (props: CTableProps) => {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // search
  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["page"]) params["page"] = 1;
    if (!params["take"]) params["take"] = 10;
    return params;
  };
  const handleGetPage = () => {
    const current_age = searchParams.get("page");
    const page_size = searchParams.get("take");
    return {
      currentPage: current_age ? +current_age : 1,
      pageSize: page_size ? +page_size : 10,
    };
  };
  const { currentPage, pageSize } = handleGetPage();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  // search
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
  });
  // search
  const [keySearch, setKeySearch] = useState<KeySearchType>({});
  const [flagSearch, setFlagSearch] = useState(false);
  // search
  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { getAppointmentStatus } = apiAppointmentStatusService();
  //permissions
  const { hasPermission } = usePermissionCheck("status-schedule");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["STATUS-SCHEDULE", param_payload, pathname],
    queryFn: () => getAppointmentStatus(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res && Array.isArray(data_res))
      return data_res.map((item) => ({ ...item, key: item?.id }));
    return [];
  }, [data]);
  const selectedRowLabels = useMemo(() => {
    return dataConvert
      .filter((item) => selectedRowKeys.includes(item.key))
      .map((item) => item.name);
  }, [selectedRowKeys]);
  const togglePopup = (params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  };
  const hasSelected = selectedRowKeys.length > 0;
  useEffect(() => {
    if (data && data?.meta) {
      setPage((prev) => ({
        ...prev,
        totalItem: data?.meta?.itemCount ?? 1,
      }));
      // Update total items from API response
    }
  }, [data]);
  // search
  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
  }, []);
  useEffect(() => {
    if (flagSearch) handleSearch();
  }, [flagSearch]);
  // search
  useEffect(() => {
    if (!code && !pathname.includes("create")) return;
    if (pathname.includes("view")) {
      navigate(`/admin/status-schedule/view/${code}`);
      togglePopup("edit");
    }
    if (pathname.includes("edit")) {
      navigate(`/admin/status-schedule/edit/${code}`);
      togglePopup("edit");
    }
    if (pathname.includes("create")) {
      togglePopup("edit");
      return;
    }
  }, []);
  // search
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: page.currentPage,
      take: page.pageSize,
    });
    let url = `${pathname}${filter}`;
    setFlagSearch(false);
    navigate(url);
  };

  // search
  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    setPage((prev) => ({ ...prev, currentPage: pageNumber }));
    setFlagSearch(true);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    setPage((prev) => ({ ...prev, pageSize }));
    setFlagSearch(true);
  };
  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  return (
    <>
      <TopTableCustom
        actions={{
          createFn: () => {
            navigate("/admin/status-schedule/create");
            togglePopup("edit");
          },
          downloadFn: () => {
            console.log("this fn download");
          },
          uploadFn: () => {
            togglePopup("upload");
          },
        }}
      />
      <Box className="custom-table-wrapper">
        <SearchBoxTable
          keySearch={keySearch}
          setKeySearch={setKeySearch}
          handleSearch={handleSearch}
        />

        {flagSearch && keySearch?.name__like && (
          <div>{`Có ${page.totalItem} kết quả cho từ khóa '${keySearch?.name__like}'`}</div>
        )}
        {/* <Card> */}
        <Table
          size="middle"
          locale={{
            emptyText: (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col">
                  <EmptyIcon />
                  <p className="text-center mt-3">Không có dữ liệu</p>
                </div>
              </div>
            ),
          }}
          bordered
          // rowSelection={rowSelection}
          loading={isLoading}
          dataSource={dataConvert}
          columns={getColumns({
            actions,
          })}
          pagination={false}
          scroll={{ x: "100%" }}
          className="custom-table"
        />
        {/* search */}
        <Pagination
          className="custom-pagination"
          pageSize={page.pageSize}
          current={page.currentPage}
          showQuickJumper
          defaultCurrent={10}
          showSizeChanger
          locale={{
            items_per_page: "bản ghi/trang",
            jump_to: "Đến",
            page: "trang",
          }}
          onShowSizeChange={onShowSizeChange}
          total={page.totalItem}
          onChange={onChangePage}
          showTotal={(total, range) => {
            return `Hiển thị ${range[0]}-${range[1]} của ${total} mục`;
          }}
        />
        {/* </Card> */}
      </Box>
      {/*  */}
      <ModalEdit open={popup.edit} toggle={togglePopup} refetch={refetch} />
      {/*  */}
      <PopupConfirmRemove
        listItem={selectedRowKeys}
        open={popup.remove}
        handleClose={() => {
          togglePopup("remove");
        }}
        refetch={refetch}
        name_item={selectedRowLabels}
      />
      {/*  */}
      <PopupConfirmImport
        open={popup.upload}
        handleClose={() => {
          togglePopup("upload");
        }}
        refetch={refetch}
      />
    </>
  );
};

export default CTable;
