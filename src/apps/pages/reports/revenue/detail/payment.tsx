import { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Tooltip, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { convertStringToArray, formatCurrency, formatCurrencyNoUnit, getFormattedMonthFromNumber } from "@/utils";
import { convertObjToParam, parseQueryParams } from "@/utils/filter";
import { KeySearchType, OptionSelect } from "@/types/types";
import { formatDate } from "@/utils/date-time";
import StatusCardV2 from "@/components/status-card/index-v2";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import MySelect from "@/components/input-custom-v2/select";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import { handleGetDataCommon } from "@/utils/fetch";
import apiPaymentMethodsService from "@/api/apiPaymentMethods.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import HeaderReport from "../../component/header";
import { downloadExcelFile } from "@/api/apiCommon.service";
import PopupPopupConfirm from "../../component/popup-confirm";
import apiReportService from "@/api/apiReport";
import _ from "lodash";

const CustomCardList = ({ dataConvert }: any) => {
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

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã đơn hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.order_id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tên khách hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.customer_name && item?.customer_name.length > 20 ?
                  item?.customer_name.slice(0, 30) + "..." :
                  item?.customer_name ? item?.customer_name :
                    "Khách lẻ"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Sđt Khách hàng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.customer_phone_number ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thời gian thanh toán</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {formatDate(item?.time_payment, "DDMMYYYY")}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thu ngân</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.cashier ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">PTTT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.method_payment ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Số tiền thanh toán</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.money_payment)}</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

const getColumns = () => {
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
            {item?.order_id}
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
        const tooltip = item?.customer_name ?? "Khách lẻ";
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
            {d?.customer_phone_number ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      width: 160,
      title: "Thời gian thanh toán",
      dataIndex: "price",
      render: (_: any, d: any) => (
        <Typography.Text>
          {formatDate(d?.time_payment, "DDMMYYYY")}
        </Typography.Text>
      ),
    },
    {
      title: "Thu ngân",
      dataIndex: "active",
      width: 300,
      render: (_: any, d: any) => {
        return (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {d?.cashier ?? "- -"}
          </Typography>
        );
      },
    },
    {
      title: "PTTT",
      dataIndex: "PTTT",
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
            {d?.method_payment ?? "- -"}
          </Typography>
        </Stack>
      ),
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
            {formatCurrency(d?.money_payment)}
          </Typography>
        </Stack>
      ),
    },
  ];
  return columns;
};

const CTablePayment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const { pathname } = useLocation();
  const [formData, setFormData] = useState(REPORT_REVENUE);

  const handleGetParam = () => {
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;

    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["month"]) params["month"] = month;
    if (!params["page"]) params["page"] = 1;
    if (!params["limit"]) params["limit"] = 10;
    return params;
  };
  const handleGetPage = () => {
    const current_age = searchParams.get("page");
    const page_size = searchParams.get("limit");
    return {
      currentPage: current_age ? +current_age : 1,
      pageSize: page_size ? +page_size : 10,
    };
  };

  const { currentPage, pageSize } = handleGetPage();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);

  const [keySearch, setKeySearch] = useState<KeySearchType>({});
  const [flagSearch, setFlagSearch] = useState(false);
  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });
  const { getReportRevenuePaymentMethod } = apiReportService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_REPORT_REVENUE_PAYMENT_METHOD", param_payload, pathname],
    queryFn: () => getReportRevenuePaymentMethod(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data
    if (data_res)
      return data_res.list_payment_method_detail;
    return [];
  }, [data]);

  useEffect(() => {
    if (data && data?.data.meta) {
      setPage((prev) => ({
        ...prev,
        totalItem: data?.data?.meta?.itemCount ?? 1,
      }));
      // Update total items from API response
    }
  }, [data]);
  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
  }, []);
  useEffect(() => {
    if (flagSearch) handleSearch();
  }, [flagSearch]);

  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: page.currentPage,
      take: page.pageSize,
    });
    let url = `${pathname}${filter}`;
    setFlagSearch(false);
    navigate(url);
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    setPage((prev) => ({ ...prev, currentPage: pageNumber }));
    searchParams.set("page", pageNumber.toString());
    setSearchParams(searchParams);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setPage((prev) => ({ ...prev, pageSize }));
    searchParams.set("limit", pageSize.toString());
    setSearchParams(searchParams);
  };
  const { getPaymentMethods } = apiPaymentMethodsService();

  const [errors, setErrors] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<OptionSelect>([]);

  const initData = () => {
    const convert_payment_method = (data: any) => {
      if (!Array.isArray(data)) return [];
      const data_convert = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      const all_data_convert = [{ value: "0", label: "Tất cả" }, ...data_convert];
      return all_data_convert
    };
    handleGetDataCommon(getPaymentMethods, convert_payment_method, setPaymentMethods,);
  };
  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    let payment_method_id: any = []
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;
    const formattedMonth = param_payload?.month ? getFormattedMonthFromNumber(param_payload.month) : month;

    if (paymentMethods.length > 0) {
      payment_method_id = param_payload?.payment_method_id ?
        convertStringToArray(param_payload.payment_method_id) :
        paymentMethods?.map(item => item.value);
    }
    setFormData(prev => ({
      ...prev,
      month: formattedMonth,
      payment_method: payment_method_id
    }))
  }, [param_payload, paymentMethods])

  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;
    if (name === "payment_method") {
      const option = paymentMethods;
      const old_value = formData["payment_method"];
      const item_click = _.xor(old_value, value)[0];
      let new_value = value;
      let new_value_params = value
      if (item_click == "0" && old_value.length === option.length) {
        new_value = [];
        new_value_params = ["-1"];
      }
      if (item_click == "0" && old_value.length !== option.length) {
        new_value = option.map((x) => x.value);
        new_value_params = [];
      }
      if (item_click != "0") {
        new_value = value.filter((x: any) => x != "0" && x != "-1");
        new_value_params = value.filter((x: any) => x != "0" && x != "-1");
      }

      searchParams.set("payment_method_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    let convert_value = value;
    setFormData((prev) => ({ ...prev, [name]: convert_value }));
  };
  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const date = new Date(value);
    const month = date.getMonth() + 1;

    searchParams.set("month", month.toString());
    setSearchParams(searchParams);
  };

  const arrayButtonExport = [
    {
      label: "Báo cáo phương thức thanh toán",
      fn: () => {
        setPopup(true);
        setContent("báo cáo phương thức thanh toán");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile('report/revenue/payment-method/export', param_payload)
  }

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-5 text-sm bg-white">
        <b onClick={() => { navigate("/admin/report-revenue"); }}
          className="text-[var(--text-color-primary)] cursor-pointer">Báo cáo doanh thu</b>
        <FontAwesomeIcon icon={faAngleRight} />
        <span>Chi tiết báo cáo thẻ liệu trình</span>

      </div>
      <HeaderReport arrayButtonExport={arrayButtonExport} />
      <div className="sm:mx-4">
        <Box className="custom-table-wrapper relative">
          <div className="wrapper-from flex-wrap flex gap-4 items-start ">
            {/* date_time */}
            <MyDatePicker
              label={"Lọc theo thời gian"}
              errors={errors}
              // required={KEY_REQUIRED}
              configUI={{
                width: "calc(25% - 12.8px)",
              }}
              name="month"
              placeholder="Chọn"
              values={formData}
              handleChange={handleOnchangeDate}
              validate={{}}
              formatInput="YYYY-MM-DD"
              picker="month"
              formatCalendar="MM/YYYY"
              disabled={formData.id}
            />
            <MySelect
              configUI={{
                width: "calc(25% - 12.8px)",
              }}
              label="Phương thức thanh toán"
              name="payment_method"
              handleChange={handleOnchange}
              values={formData}
              options={paymentMethods}
              errors={errors}
              validate={{}}
              itemsPerPage={5}
              type="select-multi"
            />
          </div>
          <div className="payment-from flex-wrap flex gap-4 items-center">
            <div className="flex flex-col justify-center items-start gap-3">
              <p style={{
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "22px",
                color: "#1D2939"
              }}>Thẻ trả trước</p>
              <div className="flex-wrap flex items-center gap-4 self-stretch">
                <StatusCardV2
                  statusData={{
                    label: "Tổng lượt thanh toán",
                    value: data?.data?.prepaid_card?.total_payment,
                    color: "#7A52DE",
                  }}
                  customCss="min-w-[200px] w-calc(100vh - 12px)"
                />
                <StatusCardV2
                  statusData={{
                    label: "Tổng tiền thanh toán",
                    value: `${data && formatCurrencyNoUnit(data?.data?.prepaid_card?.total_payment_amount)} vnđ`,
                    color: "#217732",
                  }}
                  customCss="min-w-[200px]  w-calc(100vh - 12px)"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-start gap-3">
              <p style={{
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "22px",
                color: "#1D2939"
              }}>Thẻ liệu trình</p>
              <div className="flex-wrap flex items-center gap-4 self-stretch">
                <StatusCardV2
                  statusData={{
                    label: "Tổng lượt thanh toán",
                    value: data?.data?.treatment_card?.total_payment,
                    color: "#7A52DE",
                  }}
                  customCss="min-w-[200px]  w-calc(100vh - 12px)"
                />
                <StatusCardV2
                  statusData={{
                    label: "Tổng tiền thanh toán",
                    value: `${data && formatCurrencyNoUnit(data?.data?.treatment_card?.total_payment_amount)} vnđ`,
                    color: "#217732",
                  }}
                  customCss="min-w-[200px]  w-calc(100vh - 12px)"
                />
              </div>
            </div>
          </div>
          {/* <Card> */}
          <CustomCardList dataConvert={dataConvert} />
          {dataConvert.length < 1 && <Empty className="hidden max-sm:block w-full justify-center items-center" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          <Table
            size="middle"
            bordered
            // rowSelection={rowSelection}
            loading={isLoading}
            dataSource={dataConvert}
            columns={getColumns()}
            pagination={false}
            scroll={{ x: "100%", y: "calc(100vh - 150px)" }}
            className="custom-table hidden md:block sm:max-h-[calc(100vh-200px)]"
          />
          <Pagination
            className="custom-pagination bg-white max-lg::overflow-hidden"
            pageSize={page.pageSize}
            current={page.currentPage}
            showQuickJumper
            defaultCurrent={10}
            showSizeChanger
            locale={{
              items_per_page: 'bản ghi/trang',
              jump_to: 'Đến',
              page: 'trang',
            }}
            onShowSizeChange={onShowSizeChange}
            total={page.totalItem}
            onChange={onChangePage}
            showTotal={(total, range) => {
              return `Hiển thị ${range[0]}-${range[1]} của ${total} mục`;
            }}
          />
          {/* search */}
        </Box>
      </div>
      <PopupPopupConfirm
        open={popup}
        onClose={() => {
          setPopup(false);
        }}
        onConfirm={handleOnConfirm}
        content={content}
      />
    </>
  );
};

export default CTablePayment;

