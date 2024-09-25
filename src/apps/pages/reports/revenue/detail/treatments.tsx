import React, { useState, useEffect, useMemo } from "react";
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
import apiAccountService from "@/api/Account.service";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import apiPaymentMethodsService from "@/api/apiPaymentMethods.service";
import apiReportService from "@/api/apiReport";
import _ from "lodash";
import HeaderReport from "../../component/header";
import PopupPopupConfirm from "../../component/popup-confirm";
import { downloadExcelFile } from "@/api/apiCommon.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

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
              <span>
                {item?.cashier ?? "- -"}
              </span>
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
              <span>{formatCurrency(item?.money_payment) ?? "0đ"}</span>
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

const CTableTreatments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const { pathname } = useLocation();

  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    const date = new Date();
    const month = date.getMonth() + 1;
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
  const { getReportTreatment } = apiReportService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_REPORT_TREATMENT", param_payload, pathname],
    queryFn: () => getReportTreatment(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res)
      return data_res.list_treatment;
    return [];
  }, [data]);

  useEffect(() => {
    if (data && data?.data?.meta) {
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
  const { getAccount } = apiAccountService();
  const { getCustomerSource } = apiCustomerSourceService();
  const { getPaymentMethods } = apiPaymentMethodsService();
  const [formData, setFormData] = useState(REPORT_REVENUE);
  const [errors, setErrors] = useState<string[]>([]);
  const [account, setAccount] = useState<OptionSelect>([]);
  const [customerSource, setCustomerSource] = useState<OptionSelect>([]);
  const [paymentMethods, setPaymentMethods] = useState<OptionSelect>([]);

  const initData = () => {
    const convert_account = (data: any) => {
      if (!Array.isArray(data)) return [];
      const accounts = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.full_name,
      }));
      const all_account = [{ value: "0", label: "Tất cả" }, ...accounts];
      return all_account
    };
    const convert_customer_source = (data: any) => {
      if (!Array.isArray(data)) return [];
      const data_convert = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      const all_data_convert = [{ value: "0", label: "Tất cả" }, ...data_convert];
      return all_data_convert

    };
    const convert_payment_method = (data: any) => {
      if (!Array.isArray(data)) return [];
      const data_convert = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      const all_data_convert = [{ value: "0", label: "Tất cả" }, ...data_convert];
      return all_data_convert

    };
    handleGetDataCommon(getAccount, convert_account, setAccount);
    handleGetDataCommon(getCustomerSource, convert_customer_source, setCustomerSource);
    handleGetDataCommon(getPaymentMethods, convert_payment_method, setPaymentMethods,);
  };

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    let executor_staff_id: any = []
    let contact_staff_id: any = []
    let customer_source_id: any = []
    let payment_method_id: any = []
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;
    const formattedMonth = param_payload?.month ? getFormattedMonthFromNumber(param_payload.month) : month;

    if (account.length > 0) {
      executor_staff_id = param_payload?.executor_staff_id ?
        convertStringToArray(param_payload.executor_staff_id) :
        account?.map(item => item.value);
    }
    if (account.length > 0) {
      contact_staff_id = param_payload?.contact_staff_id ?
        convertStringToArray(param_payload.contact_staff_id) :
        account?.map(item => item.value);
    }
    if (customerSource.length > 0) {
      customer_source_id = param_payload?.customer_source_id ?
        convertStringToArray(param_payload.customer_source_id) :
        customerSource?.map(item => item.value);
    }
    if (paymentMethods.length > 0) {
      payment_method_id = param_payload?.payment_method_id ?
        convertStringToArray(param_payload.payment_method_id) :
        paymentMethods?.map(item => item.value);
    }
    setFormData(prev => ({
      ...prev,
      month: formattedMonth,
      person_in_charge: executor_staff_id,
      contact_staff: contact_staff_id,
      customer_source: customer_source_id,
      payment_method: payment_method_id
    }))
  }, [param_payload, account, customerSource, paymentMethods])

  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;
    if (name === "person_in_charge") {
      const option = account;
      const old_value = formData["person_in_charge"];
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

      searchParams.set("executor_staff_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    if (name === "contact_staff") {
      const option = account;
      const old_value = formData["contact_staff"];
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

      searchParams.set("contact_staff_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    if (name === "customer_source") {
      const option = customerSource;
      const old_value = formData["customer_source"];
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

      searchParams.set("customer_source_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
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
      label: "Báo cáo doanh thu thẻ trả trước",
      fn: () => {
        setPopup(true);
        setContent("báo cáo doanh thu thẻ trả trước");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile('report/revenue/treatment/export', param_payload)
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
                width: "calc(20% - 12.8px)",
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
                width: "calc(20% - 12.8px)",
              }}
              label="Nhân viên phụ trách"
              name="person_in_charge"
              handleChange={handleOnchange}
              values={formData}
              options={account}
              errors={errors}
              validate={{}}
              itemsPerPage={5}
              type="select-multi"
            />
            <MySelect
              configUI={{
                width: "calc(20% - 12.8px)",
              }}
              label="Nhân viên liên hệ"
              name="contact_staff"
              handleChange={handleOnchange}
              values={formData}
              options={account}
              errors={errors}
              validate={{}}
              itemsPerPage={5}
              type="select-multi"
            />
            <MySelect
              configUI={{
                width: "calc(20% - 12.8px)",
              }}
              label="Nguồn khách hàng"
              name="customer_source"
              handleChange={handleOnchange}
              values={formData}
              options={customerSource}
              errors={errors}
              validate={{}}
              itemsPerPage={5}
              type="select-multi"
            />
            <MySelect
              configUI={{
                width: "calc(20% - 12.8px)",
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
          <div className="wrapper-from flex-wrap flex gap-4 items-center">
            <StatusCardV2
              statusData={{
                label: "Tổng lượt thanh toán",
                value: `${data && data?.data?.treatment_card?.total_payment}`,
                color: "#7A52DE",
              }}
              customCss="min-w-[250px]"
            />
            <StatusCardV2
              statusData={{
                label: "Tổng số lượt đã sử dụng",
                value: `${data && (data?.data?.treatment_card?.total_amount_paid)}`,
                color: "#217732",
              }}
              customCss="min-w-[250px]"
            />
            <StatusCardV2
              statusData={{
                label: "Tổng số tiền mua thẻ",
                value: `${data && formatCurrencyNoUnit(data?.data?.treatment_card?.total_payment_amount)} vnđ`,
                color: "#217732",
              }}
              customCss="min-w-[250px]"
            />
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
            className="custom-pagination  bg-white max-lg::overflow-hidden"
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

export default CTableTreatments;

