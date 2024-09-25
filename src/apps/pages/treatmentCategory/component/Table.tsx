import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, PaginationProps, Empty, Tooltip } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { formatCurrency } from "@/utils";
import usePermissionCheck from "@/hooks/usePermission";
import {
  convertObjToParam,
  handleGetPage,
  parseQueryParams,
} from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import CStatus from "@/components/status";
import apiPrepaidCardFaceService from "@/api/apiPrepaidCardFace.service";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";
import apiOrderDetailTreatment from "@/api/apiOrderDetailTreatment.service";
import { formatDate } from "@/utils/date-time";
import ActionButton from "@/components/button/action";
import EmptyIcon from "@/components/icons/empty";
import { setTotalItems } from "@/redux/slices/page.slice";
import SearchBoxTable from "@/components/search-box-table";
interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
}
const CustomCardList = ({ dataConvert, actions }: any) => {
  const navigate = useNavigate();

  return (
    <div className=" flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item.id}
          className="border border-solid border-gray-4 shadow rounded-lg mb-4"
        >
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã thẻ</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên khách hàng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.order_detail?.order?.customer?.full_name ?? "- -" ?? "Không có tên"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Số điện thoại</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.order_detail?.order?.customer?.phone_number ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tên loại thẻ</span>
            <div className="text-gray-9 text-base py-1">
              <span> {item?.order_detail?.treatment?.name ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Dịch vụ</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.order_detail?.treatment?.treatment_service
                .map((x: any) => x.service.name)
                .join(",")}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Số lần sử dụng</span>
            <div className="text-gray-9 text-base py-1">
              <span>{`${item?.number_of_treatment_used}/${item?.number_of_treatment_used + item?.number_of_remaining_treatments}`}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tổng tiền</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.unit_price)}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Ngày đăng ký</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatDate(item?.created_at, "DDMMYYYY")}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Ngày hết hạn
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {formatDate(item?.expiration_date, "DDMMYYYY") ?? "--"}
              </span>
            </div>
          </div>

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
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
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
      ),
      width: 50,
    },
    {
      title: "Mã thẻ",
      dataIndex: "id",
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
      width: 80,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customers_name",
      fixed: "left" as const,
      render: (_: any, item: any) => (
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {item?.order_detail?.order?.customer?.full_name ?? "- -"}
        </Typography>
      ),
      width: 220,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 120,
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: 400,
            color: "var(--text-color-three)",
          }}
        >
          {d?.order_detail?.order?.customer?.phone_number ?? "- -"}
        </Typography>
      ),
    },

    {
      title: "Tên loại thẻ",
      dataIndex: "treatment",
      width: 200,
      render: (_: any, item: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {item?.order_detail?.treatment?.name ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      width: 220,
      render: (_: any, item: any) => {
        const tooltip = item?.order_detail?.treatment?.treatment_service
          .map((x: any) => x.service.name)
          .join(",");
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
              {content ?? "- -"}
            </Tooltip>
          </Typography>
        );
      },
    },
    {
      width: 160,
      title: "Số lần sửa dụng",
      dataIndex: "paid",
      render: (_: any, d: any) => (
        <Typography.Text>{`${d?.number_of_treatment_used}/${d?.number_of_treatment_used + d?.number_of_remaining_treatments
          }`}</Typography.Text>
      ),
    },
    {
      width: 120,
      title: "Tổng tiền",
      dataIndex: "paid",
      render: (_: any, d: any) => (
        <Typography.Text>{formatCurrency(d?.unit_price)}</Typography.Text>
      ),
    },
    {
      width: 150,
      title: "Ngày đăng ký",
      dataIndex: "use_time",
      render: (_: any, d: any) => (
        <Typography.Text>
          {formatDate(d?.created_at, "DDMMYYYY")}
        </Typography.Text>
      ),
    },
    {
      width: 120,
      title: "Ngày hết hạn",
      dataIndex: "expiration_date",
      render: (_: any, d: any) => (
        <Typography.Text>
          {formatDate(d?.expiration_date, "DDMMYYYY") ?? "--"}
        </Typography.Text>
      ),
    },
  ];

  return columns;
};
const keywords = ["create", "view", "edit"];

const TreatmentOrderDetailTable = () => {
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
  const { getOrderDetailTreatment } = apiOrderDetailTreatment();
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
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
  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);

  // -- const
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
  const [keySearch, setKeySearch] = useState<KeySearchType>({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_ORDER_DETAIL_TREATMENT", param_payload, pathname],
    queryFn: () => getOrderDetailTreatment(param_payload),
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

  // -- effect
  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
  }, [window.location.href]);
  const text_search = useMemo(
    () => keySearch?.text?.toString() ?? "",
    [keySearch?.text, pathname],
  );
  return (
    <>
      <Box className="custom-table-wrapper">
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
            placeholder="Tìm theo tên khách hàng"
          />
        </div>

        {search.includes("text") && key_search?.text && (
          <div>
            {dataConvert.length
              ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.text}'`
              : `Không tìm thấy nội dung nào phù hợp với '${key_search?.text}'`}
          </div>
        )}
        <CustomCardList dataConvert={dataConvert} actions={actions} />
        {dataConvert.length < 1 && (
          <Empty
            className="hidden max-sm:block w-full justify-center items-center"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
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
          className="custom-table hidden md:block sm:max-h-[calc(100vh-200px)]"
        />

        {/* </Card> */}
      </Box>
    </>
  );
};

export default TreatmentOrderDetailTable;
