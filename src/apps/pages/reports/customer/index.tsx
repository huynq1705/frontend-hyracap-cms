import React, { useState, useEffect, useMemo } from "react";
import HeaderReport from "../component/header";
import { Box, Stack } from "@mui/material";
import PopupPopupConfirm from "../component/popup-confirm";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Empty, Pagination, PaginationProps, Table, Tooltip, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { handleGetDataCommon } from "@/utils/fetch";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import ActionButton from "@/components/button/action";
import StatusCardV3 from "@/components/status-card/index-v3";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import apiReportService from "@/api/apiReport";
import { downloadExcelFile } from "@/api/apiCommon.service";
import { getFormattedDaysOfMonth } from "../commission";

const CustomCardList = ({ dataConvert }: any) => {
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

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã nhân viên</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tên nhân viên</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.full_name.length > 20 ?
                  item?.full_name.slice(0, 30) + "..." :
                  item?.full_name ? item?.full_name :
                    "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Chức vụ
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.position ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Lượt đánh giá</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.total_reviews}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Điểm trung bình</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.average_rating}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">1 sao</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.one_star}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">2 sao</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.two_star}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">3 sao</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.three_star}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">4 sao</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.four_star}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">5 sao</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.five_star}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thao tác</span>
            <div className="text-gray-9 text-base py-1">
              <div className="flex items-center g-8 justify-start space-x-4">
                <ActionButton
                  type="view"
                  onClick={() => {
                    navigate(
                      `/admin/report-customer/employee/${item?.id}`,
                    );
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

const getColumns = () => {
  const navigate = useNavigate();
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
            {item?.id}
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
      width: 190,
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
      title: "Lượt đánh giá",
      dataIndex: "price",
      width: 120,
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.total_reviews}
        </Typography.Text>
      ),
    },
    {
      title: "Điểm trung bình",
      dataIndex: "price",
      width: 140,
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.average_rating.toFixed(2)}
        </Typography.Text>
      ),
    },
    {
      title: "1 sao",
      dataIndex: "price",
      width: 69,
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.one_star}
        </Typography.Text>
      ),
    },
    {
      title: "2 sao",
      dataIndex: "price",
      width: 69,
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.two_star}
        </Typography.Text>
      ),
    },
    {
      title: "3 sao",
      dataIndex: "price",
      width: 69,
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.three_star}
        </Typography.Text>
      ),
    },
    {
      title: "4 sao",
      dataIndex: "price",
      width: 69,
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.four_star}
        </Typography.Text>
      ),
    },
    {
      title: "5 sao",
      dataIndex: "price",
      width: 69,
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.five_star}
        </Typography.Text>
      ),
    },
    {
      title: "Thao tác",
      width: 79,
      dataIndex: "actions",
      fixed: "right" as const,
      shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
      zIndex: 100,
      render: (_: any, d: any) => (
        <>
          <Stack
            direction={"row"}
            sx={{
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              px: "9px",
            }}
          >
            <ActionButton
              type="view"
              onClick={() => {
                navigate(
                  `/admin/report-customer/employee/${d?.id}`,
                );
              }}
            />
          </Stack>
        </>
      ),
    },
  ];
  return columns;
};

export default function ReportCustomerPage() {
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [formData, setFormData] = useState(REPORT_REVENUE);
  const [errors, setErrors] = useState<string[]>([]);
  const { getReportEvaluationCriteria } = apiReportService();
  const [evaluationCriteria, setEvaluationCriteria] = useState<any>();

  const initData = () => {
    const convert_account = (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.slice(0, 4);
    };
    handleGetDataCommon(getReportEvaluationCriteria, convert_account, setEvaluationCriteria);
  };
  useEffect(() => {
    initData();
  }, []);


  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    const anyDate = new Date();
    const days = getFormattedDaysOfMonth(anyDate);

    if (!params["startDate"]) params["startDate"] = days.firstDay;
    if (!params["endDate"]) params["endDate"] = days.lastDay;
    if (!params["type"]) params["type"] = 1;
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

  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });
  const { getReportAccount } = apiReportService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_REPORT_ACCOUNT", param_payload, pathname],
    queryFn: () => getReportAccount(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res && data_res.table)
      return data_res.table
    return [];
  }, [data]);

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

  const arrayButtonExport = [
    {
      label: "Báo cáo đánh giá khách hàng",
      fn: () => {
        setPopup(true);
        setContent("báo cáo đánh giá khách hàng");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile('report/export-account', param_payload)
  }

  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const anyDate = new Date(value);
    const days = getFormattedDaysOfMonth(anyDate);
    searchParams.set("startDate", days.firstDay);
    searchParams.set("endDate", days.lastDay);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (param_payload?.startDate) {
      setFormData(prev => ({ ...prev, month: param_payload.startDate }))
    }
  }, [param_payload])

  return (
    <>
      <Box
        className="relative flex flex-col  overflow-y-auto"
      >
        <HeaderReport arrayButtonExport={arrayButtonExport} />
        <Box
          className="w-[calc(100% - 32px)] sm:mx-4 flex-grow  rounded-[12px] content-center-custom"
        >
          <Box width="100%" className="custom-table-wrapper "
          >
            <div className="wrapper-from flex-wrap flex gap-4 items-start ">
              <MyDatePicker
                label={"Lọc theo thời gian"}
                errors={errors}
                // required={KEY_REQUIRED}
                configUI={{
                  width: "calc(25% - 8px)",
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
            </div>
            <div className="px-4 py-5 flex flex-col gap-4 self-stretch rounded-xl"
              style={{
                border: "1px solid #D0D5DD"
              }}>
              <p style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#101828",
              }} >
                1. Báo cáo đánh giá nhân viên
              </p>
              {/* Table */}
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
                className="custom-table hidden md:block sm:max-h-[calc(100vh-200px)] min-h-[calc(100vh-650px)]"
              />
              <Pagination
                className="custom-pagination  bg-white max-lg::overflow-hidden !relative left-0 right-0"
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
            </div>
            <div className="px-4 py-5 flex flex-col gap-4 self-stretch rounded-xl "
              style={{
                border: "1px solid #D0D5DD"
              }} >
              <p style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#101828",
              }}>
                2. Báo cáo theo các tiêu chí khác
              </p>
              <div className="wrapper-from gap-4">
                {evaluationCriteria && evaluationCriteria.map((e: any) => {
                  return (
                    <StatusCardV3
                      statusData={{
                        code: `${e.evaluation_criteria_id}`,
                        label: `${e.evaluation_criteria_name}`,
                        value: `${e.average_rating.toFixed(2)}`,
                        reviews: `${e.total_usage}`
                      }}
                      customCss="w-[calc(25%-12px)]"
                    />
                  )
                })}
              </div>
            </div>
          </Box>
        </Box>
      </Box>
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
}
