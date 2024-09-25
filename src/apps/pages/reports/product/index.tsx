import React, { useState, useEffect, useMemo } from "react";
import HeaderReport from "../component/header";
import { Box, Stack } from "@mui/material";
import PopupPopupConfirm from "../component/popup-confirm";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import StatusCardV2 from "@/components/status-card/index-v2";
import {
  Empty,
  Pagination,
  PaginationProps,
  Table,
  Tooltip,
  Typography,
} from "antd";
import {
  formatCurrency,
  formatCurrencyNoUnit,
  getFormattedMonthFromNumber,
} from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import apiReportService from "@/api/apiReport";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import { downloadExcelFile } from "@/api/apiCommon.service";

const CustomCardList = ({ dataConvert }: any) => {
  return (
    <div className=" flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item?.product_code}
          className="border border-solid border-gray-4 shadow rounded-lg mb-4"
        >
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã sản phẩm</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.product_code}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên sản phẩm
            </span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.product_name.length > 20
                  ? item?.product_name.slice(0, 30) + "..."
                  : item?.product_name}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Danh mục sản phẩm
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.product_category ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Số lượt bán ra
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.total_sold}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tồn kho</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.total_stock}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tổng doanh thu
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.total_revenue)}</span>
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
      title: "Mã sản phẩm",
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
            {item?.product_code}
          </Typography>
        </Stack>
      ),
      width: 120,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "customer",
      fixed: "left" as const,
      render: (_: any, item: any) => {
        const tooltip = item?.product_name ?? "- -";
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
      title: "Danh mục sản phẩm",
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
            {d?.product_category ?? "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Số lượt bán ra",
      dataIndex: "price",
      width: 120,
      render: (_: any, d: any) => (
        <Typography.Text>{d?.total_sold}</Typography.Text>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "active",
      width: 120,
      render: (_: any, d: any) => {
        return (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {d?.total_stock}
          </Typography>
        );
      },
    },
    {
      title: "Tổng doanh thu",
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
            {formatCurrency(d?.total_revenue)}
          </Typography>
        </Stack>
      ),
    },
  ];
  return columns;
};

export default function ReportProductPage() {
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [formData, setFormData] = React.useState(REPORT_REVENUE);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    const date = new Date(formData.month);
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
  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });

  const { getReportProduct } = apiReportService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_REPORT_PRODUCT", param_payload, pathname],
    queryFn: () => getReportProduct(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res && data_res.table) return data_res.table.list_product;
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
      label: "Báo cáo sản phẩm",
      fn: () => {
        setPopup(true);
        setContent("báo cáo sản phẩm");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile("report/export-product", param_payload);
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
  useEffect(() => {
    if (param_payload?.month) {
      const formattedMonth = getFormattedMonthFromNumber(+param_payload.month);
      setFormData((prev) => ({ ...prev, month: formattedMonth }));
    }
  }, [param_payload]);

  return (
    <>
      <Box className="relative flex flex-col">
        <HeaderReport arrayButtonExport={arrayButtonExport} />
        <Box
          className="w-[calc(100% - 32px)] sm:mx-4 flex-grow overflow-y-auto rounded-[12px] content-center-custom"
        >
          <Box width="100%" className="custom-table-wrapper shadow relative">
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
            <div className="wrapper-from">
              <StatusCardV2
                statusData={{
                  label: "Tổng số lượng sản phẩm",
                  value: `${data?.data?.header?.total_product}`,
                  color: "#0D63F3",
                }}
              />
              <StatusCardV2
                statusData={{
                  label: "Tổng số lượng bán",
                  value: `${data?.data?.header?.total_paid}`,
                  color: "#217732",
                }}
              />
              <StatusCardV2
                statusData={{
                  label: "Tồn kho",
                  value: `${data?.data?.header?.total_stock}`,
                  color: "#F04438",
                }}
              />
              <StatusCardV2
                statusData={{
                  label: "Tổng doanh thu",
                  value: `${data &&
                    formatCurrencyNoUnit(data?.data?.header?.total_revenue)
                    } vnđ`,
                  color: "#217732",
                }}
              />
            </div>
            {/* Table */}
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
            <Pagination
              className="custom-pagination "
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
