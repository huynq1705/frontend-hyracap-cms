import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Tooltip } from "antd";
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
import ActionButton from "@/components/button/action";
import { convertObjToParam, parseQueryParams } from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import CStatus from "@/components/status";
import apiOrderService from "@/api/apiOrder.service";
import { formatDate } from "@/utils/date-time";
import StatusCard from "@/components/status-card";
import MyDateTimeRangePicker from "@/components/input-custom-v2/calendar/range-picker";
import apiCommonService from "@/api/apiCommon.service";
import SearchBoxTable from "@/components/search-box-table";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";
import EmptyIcon from "@/components/icons/empty";
import StatusCardV2 from "@/components/status-card/index-v2";
import { setTotalItems } from "@/redux/slices/page.slice";
import clsx from "clsx";
import CTableMobile from "../mobile";
import CPagination from "@/components/pagination";

interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
}

const getColumns = (props: ColumnProps) => {
  const navigate = useNavigate();
  const { T } = useCustomTranslation();
  //permissions
  const { hasPermission } = usePermissionCheck("product");

  const { actions } = props;
  const columns: any = [
    {
      title: "STT",
      dataIndex: "order",

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
      title: "Mã đơn hàng",
      dataIndex: "order_id",

      render: (_: any, item: any, index: number) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "left",
            }}
          >
            {item?.id}
          </Typography>
        </Stack>
      ),
      width: 120,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer",
      fixed: "left" as const,
      render: (_: any, item: any) => {
        const tooltip = item?.customer?.full_name ?? "Khách lẻ";
        const content =
          tooltip.length > 20 ? tooltip.slice(0, 30) + "..." : tooltip;
        return (
          <Box>
            <Tooltip placement="topLeft" title={tooltip}>
              {content}
            </Tooltip>
          </Box>
        );
      },
      width: 220,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
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
            {d?.customer?.phone_number ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      width: 160,
      title: "Thời gian",
      dataIndex: "price",
      render: (_: any, d: any) => (
        <Typography.Text>
          {formatDate(d?.created_at, "DDMMYYYYvsHHMM")}
        </Typography.Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      width: 160,
      render: (_: any, d: any) => {
        let message = "";
        let status: "warning" | "success" | "error" | "info" | undefined =
          "warning";
        if (d?.status == 0) {
          message = "Chưa thanh toán";
          status = "info";
        }
        if (d?.status == 2) {
          message = "Đã hoàn thành";
          status = "success";
        }
        if (d?.status == 1) {
          message = "Chưa hoàn thành";
          status = "warning";
        }
        return (
          <Stack direction={"column"} spacing={1}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "var(--text-color-three)",
              }}
            >
              <CStatus type={status} name={message} />
            </Typography>
          </Stack>
        );
      },
    },
    {
      title: "Nhân viên thực hiện",
      dataIndex: "active",
      width: 300,
      render: (_: any, d: any) => {
        const tooltip =
          (d?.order_detail &&
            d.order_detail.length &&
            d.order_detail
              .map((x: any) => x?.account_order[0]?.account?.full_name)
              .filter((x : any) => x)
              .join(",")) ||
          "- -";
          console.log("tooltip :", tooltip);
        const content =
          tooltip.length > 20 ? tooltip.slice(0, 30) + "..." : tooltip;
        return (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            <Tooltip placement="topLeft" title={tooltip}>
              {content}
            </Tooltip>
          </Typography>
        );
      },
    },
    {
      title: "Số tiền thanh toán",
      dataIndex: "active",
      width: 160,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {formatCurrency(d?.paid)}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "active",
      width: 160,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {formatCurrency(d?.provisional)}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "VAT",
      dataIndex: "active",
      width: 160,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {d?.VAT} %
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Tổng tiền hóa đơn",
      dataIndex: "active",
      width: 160,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {formatCurrency(d?.total)}
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
                      navigate(`/admin/order/view/${d?.id}`);
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
const CTable = () => {
  // -- fn:
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const { getStatistics } = apiCommonService();
  const { getOrder } = apiOrderService();

  const togglePopup = (params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  };
  const handleSearch = (objParam = { ...keySearch }) => {
    let filter = convertObjToParam(objParam, {
      page: currentPage,
      take: pageSize,
      text: keySearch?.text?.toString().trim(),
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const handelGetStatistics = async () => {
    try {
      const response = await getStatistics("order/statistical");
      if (response) {
        setStatistical(response);
      }
    } catch (error) {
      throw error;
    }
  };
  // -- const
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const { currentPage, pageSize } = handleGetPage();
  const { pathname } = useLocation();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  // -- state
  const page = useSelector(selectPage);
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
  });
  const [keySearch, setKeySearch] = useState<KeySearchType>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_ORDER", window.location.href],
    queryFn: () => getOrder(param_payload),
    keepPreviousData: true,
  });
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data && data?.meta) {
      dispatch(setTotalItems(data?.meta?.itemCount ?? 1));
    }
    if (data_res && Array.isArray(data_res))
      return data_res.map((item) => ({ ...item, key: item?.id }));
    return [];
  }, [data]);
  const selectedRowLabels = useMemo(() => {
    return dataConvert
      .filter((item) => selectedRowKeys.includes(item.key))
      .map((item) => item?.key);
  }, [selectedRowKeys]);
  const [statistical, setStatistical] = useState({
    total_orders: 0,
    wait_for_payment: 0,
    partial_payment: 0,
    paid_payment: 0,
  });
  const text_search = useMemo(
    () => keySearch?.text?.toString() ?? "",
    [keySearch?.text, pathname],
  );
  // -- effect
  useEffect(() => {
    handelGetStatistics();
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
    if (!code && !pathname.includes("create")) return;
    if (pathname.includes("view") && !popup.edit) {
      navigate(`/admin/prepaid-card-face-value/view/${code}`);
      togglePopup("edit");
    }
    if (pathname.includes("create") && !popup.edit) {
      togglePopup("edit");
      return;
    }
  }, [window.location.href]);
  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <>
      <Box className="custom-table-wrapper">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-2/5">
            <SearchBoxTable
              keySearch={text_search}
              setKeySearch={(value?: string) => {
                setKeySearch((prev) => ({
                  ...prev,
                  text: value || "",
                }));
              }}
              handleSearch={handleSearch}
              placeholder="Tìm theo mã đơn hàng, tên khách hàng, sđt"
            />
          </div>
          <div className="w-1/4 max-sm:w-full hidden">
            <MyDateTimeRangePicker
              name="time"
              label="Lọc theo thời gian"
              handleChange={() => {}}
              values={{ time: "2024/08/11" }}
              configUI={{
                width: "100%",
              }}
            />
          </div>
        </div>
        <div className="w-full flex gap-4 flex-wrap">
          <StatusCardV2
            statusData={{
              label: "Tổng đơn hàng",
              value: statistical.total_orders,
              color: "#0D63F3",
            }}
            hightLine="label"
            onClick={() => {
              const new_key_search: any = { ...keySearch };
              new_key_search.status__in = "2;1;0";
              handleSearch(new_key_search);
            }}
          />
          <StatusCardV2
            statusData={{
              label: "Đã hoàn thành",
              value: statistical.paid_payment,
              color: "#50945D",
            }}
            hightLine="label"
            onClick={() => {
              const new_key_search: any = { ...keySearch };
              new_key_search.status__in = "2";
              handleSearch(new_key_search);
            }}
          />
          <StatusCardV2
            statusData={{
              label: "Chưa hoàn thành",
              value: statistical.partial_payment,
              color: "#DE8208",
            }}
            hightLine="label"
            onClick={() => {
              const new_key_search: any = { ...keySearch };
              new_key_search.status__in = "1";
              handleSearch(new_key_search);
            }}
          />
          <StatusCardV2
            statusData={{
              label: "Chưa thanh toán",
              value: statistical.wait_for_payment,
              color: "#b32358",
            }}
            hightLine="label"
            onClick={() => {
              const new_key_search: any = { ...keySearch };
              new_key_search.status__in = "0";
              handleSearch(new_key_search);
            }}
          />
        </div>
        {keySearch?.name__like && (
          <div>{`Có ${page.totalItems} kết quả cho từ khóa '${keySearch?.name__like}'`}</div>
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
          scroll={{ x: "100%", }}
          className={clsx("custom-table", window.innerWidth < 768 && "!hidden")}
        />
        
        <CTableMobile dataSource={dataConvert} actions={actions} />
        {/* </Card> */}
      </Box>
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
