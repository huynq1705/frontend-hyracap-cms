import { Box, Stack } from "@mui/material";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  Empty,
  Pagination,
  PaginationProps,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { formatCurrency } from "@/utils";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import { useEffect, useMemo, useState } from "react";
import { KeySearchType, OptionSelect } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { convertObjToParam, parseQueryParams } from "@/utils/filter";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import apiCommissionsService from "@/api/apiCommissions";
import ButtonCore from "@/components/button/core";
import moment from "moment";
import PopupPopupConfirm from "../../component/popup-confirm";
import { downloadExcelFile } from "@/api/apiCommon.service";

const btnStyleBgWhite = {
  backgroundColor: "var(--btn-color-secondary)",
  color: "var(--btn-color-primary)",
};

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
            <span className="font-medium text-gray-9 text-sm">
              Mã nhân viên
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.account_id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên nhân viên
            </span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.full_name.length > 20
                  ? item?.full_name.slice(0, 30) + "..."
                  : item?.full_name
                    ? item?.full_name
                    : "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Chức vụ</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.position ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã đơn hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.order_id ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Dịch vụ/sản phẩm
            </span>
            <div className="text-gray-9 text-base py-1">
              {item?.name_service ?? "- -"}
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên khách hàng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.name_customer ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Số điện thoại KH
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.phone_number_customer ?? "- -"}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tổng tiền hoa hồng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.total_commission) ?? "- -"}</span>
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
      title: "Mã nhân viên",
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
            {item?.account_id}
          </Typography>
        </Stack>
      ),
      width: 120,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "customer",
      fixed: "left" as const,
      render: (_: any, item: any) => {
        const tooltip = item?.full_name ?? "- -";
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
      title: "Chức vụ",
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
            {d?.position ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      width: 160,
      title: "Mã đơn hàng",
      dataIndex: "price",
      render: (_: any, d: any) => (
        <Typography.Text>{d?.order_id}</Typography.Text>
      ),
    },
    {
      title: "Dịch vụ/sản phẩm",
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
            {d?.name_service ?? "- -"}
          </Typography>
        );
      },
    },
    {
      title: "Tên khách hàng",
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
            {d?.name_customer ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Số điện thoại KH",
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
            {d?.phone_number_customer ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Tổng tiền hoa hồng",
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
            {formatCurrency(d?.total_commission) ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
  ];
  return columns;
};

const CommissionDetailPage = () => {
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const { T, t } = useCustomTranslation();
  const { code } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [formData, setFormData] = useState(REPORT_REVENUE);
  const nowDay = moment().format("YYYY-MM-DD");
  const startWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");
  const startMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endMonth = moment().endOf("month").format("YYYY-MM-DD");

  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["page"]) params["page"] = 1;
    if (!params["limit"]) params["limit"] = 10;
    if (!params["from"])
      params["from"] = new Date(new Date()).toISOString().split("T")[0];
    if (!params["to"])
      params["to"] = new Date(new Date()).toISOString().split("T")[0];
    if (!params["staff_id"]) params["staff_id"] = code;
    return params;
  };

  const handleGetPage = () => {
    const current_age = searchParams.get("page");
    const page_size = searchParams.get("limit");
    const from_date = searchParams.get("from");
    const to_date = searchParams.get("to");
    return {
      currentPage: current_age ? +current_age : 1,
      pageSize: page_size ? +page_size : 10,
      fromDate: from_date
        ? from_date
        : new Date(new Date()).toISOString().split("T")[0],
      toDate: to_date
        ? to_date
        : new Date(new Date()).toISOString().split("T")[0],
    };
  };

  const { currentPage, pageSize, fromDate, toDate } = handleGetPage();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);

  const [keySearch, setKeySearch] = useState<KeySearchType>({
    from: nowDay,
    to: nowDay,
    staff_id: code,
  });

  const [flagSearch, setFlagSearch] = useState(false);
  // search
  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });

  const { getCommissions } = apiCommissionsService();
  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ["GET_COMMISSION", param_payload, pathname],
    queryFn: () => getCommissions(param_payload),
    keepPreviousData: true,
  });

  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res) return data_res.list_commissions;
    return [];
  }, [data]);
  useEffect(() => {
    if (data && data?.meta) {
      setPage((prev) => ({
        ...prev,
        totalItem: data?.meta?.itemCount ?? 1,
      }));
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

  const handleOnchangeDate = (name: string, value: any) => {
    if (name === "start_date") {
      const startDate = new Date(value);
      const endDate = new Date(formData.end_date);
      if (startDate > endDate) {
        searchParams.set("from", value);
        searchParams.set("to", value);
        setSearchParams(searchParams);
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          end_date: value,
        }));
      } else {
        searchParams.set("from", value);
        searchParams.set("to", formData.end_date);
        setSearchParams(searchParams);
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    if (name === "end_date") {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(value);
      if (endDate > startDate) {
        searchParams.set("from", formData.start_date);
        searchParams.set("to", value);
        setSearchParams(searchParams);
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else {
        searchParams.set("from", value);
        searchParams.set("to", value);
        setSearchParams(searchParams);
        setFormData((prev) => ({
          ...prev,
          start_date: value,
          [name]: value,
        }));
      }
    }

    // const date = new Date(value);
    // const month = date.getMonth() + 1;

    // searchParams.set("month", month.toString());
    // setSearchParams(searchParams);
  };
  const handleToday = () => {
    // setKeySearch({
    //   ...keySearch,
    //   startDate: nowDay,
    //   endDate: nowDay,
    // })
    searchParams.set("from", nowDay);
    searchParams.set("to", nowDay);
    setSearchParams(searchParams);
    setFormData((prev) => ({ ...prev, start_date: nowDay, end_date: nowDay }));
  };
  const handleWeek = () => {
    // setKeySearch({
    //   ...keySearch,
    //   startDate: startWeek,
    //   endDate: endWeek,
    // })
    searchParams.set("from", startWeek);
    searchParams.set("to", endWeek);
    setSearchParams(searchParams);
    setFormData((prev) => ({
      ...prev,
      start_date: startWeek,
      end_date: endWeek,
    }));
  };
  const handleMonth = () => {
    // setKeySearch({
    //   ...keySearch,
    //   startDate: startMonth,
    //   endDate: endMonth,
    // })
    searchParams.set("from", startMonth);
    searchParams.set("to", endMonth);
    setSearchParams(searchParams);
    setFormData((prev) => ({
      ...prev,
      start_date: startMonth,
      end_date: endMonth,
    }));
  };

  const arrayButtonExport = [
    {
      label: "Báo cáo đánh giá tiêu chí",
      fn: () => {
        setPopup(true);
        setContent("báo cáo đánh giá tiêu chí");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile("order/list-commissions/export", param_payload);
  };

  useEffect(() => {
    const from = param_payload?.from
      ? param_payload.from
      : new Date(new Date()).toISOString().split("T")[0];
    const to = param_payload?.to
      ? toDate
      : new Date(new Date()).toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, start_date: from, end_date: to }));
  }, [param_payload]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-3 py-3 px-5 text-sm bg-white">
        <b
          onClick={() => navigate("/admin/report-commission")}
          className="text-[var(--text-color-primary)] cursor-pointer"
        >
          Báo cáo hoa hồng
        </b>
        <FontAwesomeIcon icon={faAngleRight} />
        <span>{"Báo cáo chi tiết" ?? "- -"}</span>
      </div>
      <div className="flex flex-wrap items-start gap-3 sm:flex-row justify-between py-6 px-4 ">
        <h2>Hoa hồng nhân viên {dataConvert[0]?.full_name ?? "- -"}</h2>
        <div
          className="flex items-center button-core"
          style={btnStyleBgWhite}
          onClick={arrayButtonExport[0].fn}
        >
          <FontAwesomeIcon icon={faDownload} />
          Tải xuống
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md sm:mx-5">
        <Box className="custom-table-wrapper relative">
          <div className="flex flex-wrap md:flex-row justify-between gap-4">
            <div className="wrapper-from flex-wrap flex gap-4 justify-start">
              <MyDatePicker
                label={"Từ ngày"}
                errors={[]}
                required={[]}
                configUI={{
                  width: "calc(25% - 8px)",
                }}
                name="start_date"
                placeholder="Chọn"
                handleChange={handleOnchangeDate}
                values={formData}
                validate={{}}
                type="select-one"
                itemsPerPage={5}
              />
              <MyDatePicker
                label={"Đến ngày"}
                errors={[]}
                required={[]}
                configUI={{
                  width: "calc(25% - 8px)",
                }}
                name="end_date"
                placeholder="Chọn"
                handleChange={handleOnchangeDate}
                values={formData}
                validate={{}}
                type="select-one"
                itemsPerPage={5}
              />
              <div className="w-[calc(50%-16px)] flex gap-4 lg:justify-end items-end ">
                <Stack direction={"row"} alignItems={"flex-end"} spacing={2}>
                  <ButtonCore
                    title="Hôm nay"
                    type={
                      formData.start_date === nowDay &&
                        formData.end_date === nowDay
                        ? "default"
                        : "bgWhite"
                    }
                    onClick={handleToday}
                    styles={{ marginBottom: 8 }}
                  />
                  <ButtonCore
                    title="Tuần này"
                    type={
                      formData.start_date === startWeek &&
                        formData.end_date === endWeek
                        ? "default"
                        : "bgWhite"
                    }
                    onClick={handleWeek}
                    styles={{ marginBottom: 8 }}
                  />
                  <ButtonCore
                    title="Tháng này"
                    type={
                      formData.start_date === startMonth &&
                        formData.end_date === endMonth
                        ? "default"
                        : "bgWhite"
                    }
                    onClick={handleMonth}
                    styles={{ marginBottom: 8 }}
                  />
                </Stack>
              </div>
            </div>
          </div>
          <CustomCardList dataConvert={dataConvert} />
          {dataConvert.length < 1 && (
            <Empty
              className="hidden max-sm:block w-full justify-center items-center"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
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
          {/* search */}
          <Pagination
            className="custom-pagination  bg-white max-lg::overflow-hidden"
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
    </div>
  );
};
export default CommissionDetailPage;
