import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
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
import SearchBoxTable from "@/components/search-box-table";
import ActionButton from "@/components/button/action";
import ModalEdit from "./ModalEdit";
import {
  convertObjToParam,
  handleGetPage,
  parseQueryParams,
} from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import apiPrepaidCardFaceValueService from "@/api/apiPrepaidCardFaceValue.service";
import CStatus from "@/components/status";
import StatusCard from "@/components/status-card";
import apiCommonService from "@/api/apiCommon.service";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";
import { setTotalItems } from "@/redux/slices/page.slice";
import EmptyIcon from "@/components/icons/empty";
import StatusCardV2 from "@/components/status-card/index-v2";
interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
}
const CustomCardList = ({ dataConvert, actions }: any) => {
  const { hasPermission } = usePermissionCheck("prepaid-card-face-value");
  const navigate = useNavigate();

  return (
    <div className=" flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item.id}
          className="border border-solid border-gray-4 shadow rounded-lg mb-4"
        >
          {/* <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div> */}

          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                STT
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{index + 1}</span>
              </div>
            </div>
            <div className="min-w-[80px]">
              <span className="font-medium text-gray-9 text-sm">
                Trạng thái
              </span>
              <div className="text-gray-9 text-base py-1">
                <CStatus
                  type={item?.status ? "success" : "error"}
                  name={item?.status ? "Active" : "Inactive"}
                />
              </div>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên loại thẻ
            </span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.name ?? "Không có tên"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mệnh giá</span>
            <div className="text-gray-9 text-base py-1">
              <span> {formatCurrency(item?.denominations)}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Giá bán</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.price)}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Thời gian sử dụng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.use_time ?? "- -"} Ngày</span>
            </div>
          </div>

          {/* <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Trạng thái</span>
            <div className="text-gray-9 text-base py-1">
              <CStatus
                type={item?.status ? "success" : "error"}
                name={item?.status ? "Active" : "Inactive"}
              />
            </div>
          </div> */}

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Ghi chú</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.note}</span>
            </div>
          </div>

          {(hasPermission.update || hasPermission.delete) && (
            <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
              <span className="font-medium text-gray-9 text-sm">Thao tác</span>
              <div className="text-gray-9 text-base py-1">
                <div className="flex items-center g-8 justify-start space-x-4">
                  {hasPermission.getDetail && (
                    <ActionButton
                      type="view"
                      onClick={() => {
                        navigate(
                          `/admin/prepaid-card-face-value/view/${item?.id}`,
                        );
                        actions.togglePopup("edit");
                      }}
                    />
                  )}
                  {hasPermission.update && (
                    <ActionButton
                      type="edit"
                      onClick={() => {
                        navigate(
                          `/admin/prepaid-card-face-value/edit/${item?.id}`,
                        );
                        actions.togglePopup("edit");
                      }}
                    />
                  )}
                  {hasPermission.delete && (
                    <ActionButton
                      type="remove"
                      onClick={() => {
                        actions.openRemoveConfirm("remove", item?.id);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

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
      title: "Tên loại thẻ",
      dataIndex: "prepaid-card-face-value",
      fixed: "left" as const,
      render: (_: any, item: any) => (
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"flex-start"}
          sx={{
            alignItems: "center",
          }}
        >
          <Stack direction={"column"}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {item?.name ?? "Không có tên"}
            </Typography>
          </Stack>
        </Stack>
      ),
      width: 220,
    },
    {
      title: "Mệnh giá",
      dataIndex: "denominations",
      width: 120,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {formatCurrency(d?.denominations)}
          </Typography>
        </Stack>
      ),
    },
    {
      width: 120,
      title: "Giá bán",
      dataIndex: "price",
      render: (_: any, d: any) => (
        <Typography.Text>{formatCurrency(d?.price)}</Typography.Text>
      ),
    },
    {
      width: 150,
      title: "Thời gian sử dụng",
      dataIndex: "use_time",
      render: (_: any, d: any) => (
        <Typography.Text>{d?.use_time ?? "- -"} Ngày</Typography.Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      width: 120,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            <CStatus
              type={d?.status ? "success" : "error"}
              name={d?.status ? "Active" : "Inactive"}
            />
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 320,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {d?.note}
          </Typography>
        </Stack>
      ),
    },
  ];
  {
    (hasPermission.update || hasPermission.delete) &&
      columns.push({
        title: T("action"),
        width: 120,
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
                      navigate(`/admin/prepaid-card-face-value/view/${d?.id}`);
                      actions.togglePopup("edit");
                    }}
                  />
                )}
                {hasPermission.update && (
                  <ActionButton
                    type="edit"
                    onClick={() => {
                      navigate(`/admin/prepaid-card-face-value/edit/${d?.id}`);
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

const CTable = () => {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const dispatch = useDispatch();
  // -- fn
  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["page"]) params["page"] = 1;
    if (!params["take"]) params["take"] = 10;
    return params;
  };

  const { getStatistics } = apiCommonService();
  const { getPrepaidCardFaceValue } = apiPrepaidCardFaceValueService();
  const handleSearch = (objParam = { ...keySearch }) => {
    let filter = convertObjToParam(objParam, {
      page: currentPage,
      take: pageSize,
      text: keySearch?.text?.toString().trim(),
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };

  const togglePopup = (params: keyof typeof popup) => {
    // if (popup[params]) setFlagSearch(true);
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  };
  const handelGetStatistics = async () => {
    try {
      const response = await getStatistics(
        "prepaid-card-face-value/statistical",
      );
      if (response) {
        setStatistical(response);
      }
    } catch (error) {
      throw error;
    }
  };
  // -- const
  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  // -- state
  const page = useSelector(selectPage);
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
  });
  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__in: "0",
  });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_PREPAID_CARD_FACE_VALUE", param_payload, pathname],
    queryFn: () => getPrepaidCardFaceValue(param_payload),
    keepPreviousData: true,
  });
  const dataConvert = useMemo(() => {
    if (data && data?.meta) {
      dispatch(setTotalItems(data?.meta?.itemCount ?? 1));
    }
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

  const [statistical, setStatistical] = useState({
    total_active: 0,
    total_inactive: 0,
  });
  const text_search = useMemo(
    () => keySearch?.text?.toString() ?? "",
    [keySearch?.text, pathname],
  );
  // -- effect
  useEffect(() => {
    handelGetStatistics();
    refetch();
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
    if (!code && !pathname.includes("create")) return;
    if (pathname.includes("view") && !popup.edit) {
      navigate(`/admin/prepaid-card-face-value/view/${code}`);
      togglePopup("edit");
    }
    if (pathname.includes("edit") && !popup.edit) {
      navigate(`/admin/prepaid-card-face-value/edit/${code}`);
      togglePopup("edit");
    }
    if (pathname.includes("create") && !popup.edit) {
      togglePopup("edit");
      return;
    }
  }, [window.location.href]);

  return (
    <>
      <Box className="custom-table-wrapper">
        <div className="md:flex items-end  justify-between space-y-4 flex-wrap">
          <div className="w-full md:w-1/3">
            <SearchBoxTable
              keySearch={text_search}
              setKeySearch={(value?: string) => {
                setKeySearch((prev) => ({
                  ...prev,
                  text: value || "",
                }));
              }}
              handleSearch={handleSearch}
              placeholder="Tìm tên loại thẻ"
            />
          </div>
          <div className="gap-4 flex-wrap flex items-end justify-start lg:justify-end ">
            <StatusCardV2
              statusData={{
                label: "Tất cả thẻ",
                value:
                  statistical.total_inactive + statistical.total_active ?? 0,
                color: "blue",
              }}
              hightLine="label"
              customCss="w-full sm:w-auto !min-w-[165px]"
              onClick={() => {
                const new_key_search: any = { ...keySearch };
                new_key_search.status__in = "1;0";
                handleSearch(new_key_search);
              }}
            />
            <StatusCardV2
              statusData={{
                label: "Thẻ đang hoạt động",
                value: statistical.total_active ?? 0,
                color: "#50945D",
              }}
              hightLine="label"
              customCss="w-full sm:w-auto !min-w-[165px]"
              onClick={() => {
                const new_key_search: any = { ...keySearch };
                new_key_search.status__in = "1";
                handleSearch(new_key_search);
              }}
            />
            <StatusCardV2
              statusData={{
                label: "Thẻ ngừng hoạt động",
                value: statistical.total_inactive ?? 0,
                color: "#101828",
              }}
              hightLine="label"
              customCss="w-full sm:w-auto !min-w-[165px]"
              onClick={() => {
                const new_key_search: any = { ...keySearch };
                new_key_search.status__in = "0";
                handleSearch(new_key_search);
              }}
            />
          </div>
        </div>

        {search.includes("full_name__like") && key_search?.full_name__like && (
          <div>
            {dataConvert.length
              ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.full_name__like}'`
              : `Không tìm thấy nội dung nào phù hợp với '${key_search?.full_name__like}'`}
          </div>
        )}
        {/* <Card> */}
        <CustomCardList dataConvert={dataConvert} actions={actions} />
        {dataConvert.length < 1 && (
          <Empty
            className="hidden max-sm:block w-full justify-center items-center"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
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
          loading={isLoading}
          dataSource={dataConvert}
          columns={getColumns({
            actions,
          })}
          pagination={false}
          scroll={{ x: "100%" }}
          className="custom-table hidden md:block"
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
