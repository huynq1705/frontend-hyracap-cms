import React, { useState, useEffect, useMemo } from "react";
import HeaderReport from "../component/header";
import { Box, Stack } from "@mui/material";
import PopupPopupConfirm from "../component/popup-confirm";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import StatusCardV2 from "@/components/status-card/index-v2";
import { Empty, Pagination, PaginationProps, Table, Tooltip, Typography } from "antd";
import { convertStringToArray, formatCurrency, formatCurrencyNoUnit, getFormattedMonthFromNumber } from "@/utils";
import { OptionSelect } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import { handleGetDataCommon } from "@/utils/fetch";
import MySelect from "@/components/input-custom-v2/select";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import apiReportService from "@/api/apiReport";
import _ from "lodash";
import { downloadExcelFile } from "@/api/apiCommon.service";

const CustomCardList = ({ dataConvert }: any) => {
  return (
    <div className=" flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item?.service_code}
          className="border border-solid border-gray-4 shadow rounded-lg mb-4"
        >
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã dịch vụ</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.service_code}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tên dịch vụ</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.service_name.length > 20 ?
                  item?.service_name.slice(0, 30) + "..." :
                  item?.service_name ? item?.service_name :
                    "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Danh mục dịch vụ
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.service_catalog ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Số lượt bán ra</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.total_sold}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tổng doanh thu</span>
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
      title: "Mã dịch vụ",
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
            {item?.service_code}
          </Typography>
        </Stack>
      ),
      width: 120,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "customer",
      fixed: "left" as const,
      render: (_: any, item: any) => {
        const tooltip = item?.service_name ?? "- -";
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
      title: "Danh mục dịch vụ",
      dataIndex: "phone_number",
      width: 190,
      render: (_: any, item: any) => {
        const tooltip = item?.service_catalog ?? "- -";
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
    },
    {
      title: "Số lượt bán ra",
      dataIndex: "price",
      width: 120,
      render: (_: any, item: any) => (
        <Typography.Text>
          {item?.total_sold}
        </Typography.Text>
      ),
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "active",
      width: 160,
      render: (_: any, item: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {formatCurrency(item?.total_revenue)}
          </Typography>
        </Stack>
      ),
    },
  ];
  return columns;
};

export default function ReportServicePage() {
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [formData, setFormData] = useState(REPORT_REVENUE);
  const [errors, setErrors] = useState<string[]>([]);
  const { getServiceCatalog } = apiServiceSpaServicerService();
  const [serviceCatalog, setServiceCatalog] = useState<OptionSelect>([]);

  const initData = () => {
    const convert = (data: any) => {
      if (!Array.isArray(data)) return [];
      const services = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name ?? item.rank,
      }));
      // return all_service
      return [{ value: "0", label: "Tất cả" }, ...services]
    };
    handleGetDataCommon(getServiceCatalog, convert, setServiceCatalog);
  };
  useEffect(() => {
    initData();
  }, []);

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
    const service_catalog_id = searchParams.get("service_catalog_id")
    return {
      currentPage: current_age ? +current_age : 1,
      pageSize: page_size ? +page_size : 10,
      filer: {
        service_catalog_id: service_catalog_id?.split(',') || []
      },
    };
  };

  const { currentPage, pageSize, filer } = handleGetPage();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);

  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });
  const { getReportService } = apiReportService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_REPORT_SERVICE", param_payload, pathname],
    queryFn: () => getReportService(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data?.meta)
      setPage({
        currentPage: +data.meta?.page,
        pageSize: +data.meta?.take,
        totalPage: data.meta?.pageCount,
        totalItem: data.meta?.itemCount,

      })
    if (data_res)
      return data_res.table?.list_service;
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
      label: "Báo cáo dịch vụ",
      fn: () => {
        setPopup(true);
        setContent("báo cáo dịch vụ");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile('report/export-service', param_payload)
  }

  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;
    const option = serviceCatalog;
    const old_value = formData["service_catalog"];
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

    const date = new Date(formData.month);
    const month = date.getMonth() + 1;
    searchParams.set("service_catalog_id", new_value_params);
    setSearchParams(searchParams);
    // let filter = `?month=${month}&service_catalog_id=${new_value_params}`
    // let url = `${pathname}${filter}`;
    // navigate(url);
    setFormData((prev) => ({ ...prev, [name]: new_value }));
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
    let service_catalog_id: any = []
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;
    const formattedMonth = param_payload?.month ? getFormattedMonthFromNumber(param_payload.month) : month;

    if (serviceCatalog.length > 0) {
      service_catalog_id = param_payload?.service_catalog_id ? convertStringToArray(param_payload.service_catalog_id) : serviceCatalog?.map(item => item.value);
    }
    setFormData(prev => ({ ...prev, month: formattedMonth, service_catalog: service_catalog_id }))
  }, [param_payload, serviceCatalog])

  return (
    <>
      <Box
        className="relative flex flex-col"
      >
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
              <MySelect
                configUI={{
                  width: "calc(25% - 12px)",
                }}
                label="Danh mục dịch vụ"
                name="service_catalog"
                handleChange={handleOnchange}
                values={formData}
                options={serviceCatalog}
                errors={errors}
                validate={{}}
                itemsPerPage={5}
                type="select-multi"
              />
            </div>
            <div className="wrapper-from">
              <StatusCardV2
                statusData={{
                  label: "Tổng số dịch vụ",
                  value: `${data?.data?.header?.total_service}`,
                  color: "#0D63F3",
                }}
              />

              <StatusCardV2
                statusData={{
                  label: "Tổng lượt bán ra",
                  value: `${data?.data?.header?.total_paid}`,
                  color: "#217732",
                }}
              />
              <StatusCardV2
                statusData={{
                  label: "Tổng doanh thu",
                  value: `${data?.data?.header?.total_revenue && formatCurrencyNoUnit(data?.data?.header?.total_revenue)} vnđ`,
                  color: "#217732",
                }}
              />
            </div>
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
