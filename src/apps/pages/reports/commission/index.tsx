import React, { useState, useEffect, useMemo } from "react";
import HeaderReport from "../component/header";
import { Box, Stack } from "@mui/material";
import PopupPopupConfirm from "../component/popup-confirm";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import StatusCardV2 from "@/components/status-card/index-v2";
import {
  Empty,
  Pagination,
  PaginationProps,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { convertStringToArray, formatCurrency, formatCurrencyNoUnit, getFormattedMonthFromNumber } from "@/utils";
import { OptionSelect } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { handleGetDataCommon } from "@/utils/fetch";
import MySelect from "@/components/input-custom-v2/select";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import ActionButton from "@/components/button/action";
import apiAccountService from "@/api/Account.service";
import apiReportService from "@/api/apiReport";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import _ from "lodash";
import { downloadExcelFile } from "@/api/apiCommon.service";

export function getFormattedDaysOfMonth(date: any) {
  const getFormattedDate = (d: any) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11, nên cộng thêm 1 và đảm bảo có 2 chữ số
    const day = String(d.getDate()).padStart(2, "0"); // Đảm bảo có 2 chữ số
    return `${year}-${month}-${day}`;
  };

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    firstDay: getFormattedDate(firstDay),
    lastDay: getFormattedDate(lastDay),
  };
}

const CustomCardList = ({ dataConvert }: any) => {
  const navigate = useNavigate();

  return (
    <div className=" flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item.account_id}
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
                    : "Khách lẻ"}
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
            <span className="font-medium text-gray-9 text-sm">
              Tiền hoa hồng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.total_commission)}</span>
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
                      `/admin/report-commission/detail/${item?.account_id}`,
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
      width: 250,
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
      title: "Tiền hoa hồng",
      dataIndex: "price",
      width: 120,
      render: (_: any, d: any) => (
        <Typography.Text>{formatCurrency(d?.total_commission)}</Typography.Text>
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
                navigate(`/admin/report-commission/detail/${d?.account_id}`);
              }}
            />
          </Stack>
        </>
      ),
    },
  ];
  return columns;
};

export default function ReportCommissionPage() {
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [formData, setFormData] = useState(REPORT_REVENUE);
  const [errors, setErrors] = useState<string[]>([]);
  const { getAccount } = apiAccountService();
  const [account, setAccount] = useState<OptionSelect>([]);

  const initData = () => {
    const convert_account = (data: any) => {
      if (!Array.isArray(data)) return [];
      const accounts = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.full_name,
      }));
      const all_account = [{ value: "0", label: "Tất cả" }, ...accounts];
      return all_account;
    };
    const params = {
      page: 1,
      take: 999,
    };
    handleGetDataCommon(() => getAccount(params), convert_account, setAccount);
  };
  useEffect(() => {
    initData();
  }, []);

  const handleGetParam = () => {
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;

    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["month"]) params["month"] = month;
    if (!params["account_id"]) params["account_id"] = undefined;
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

  const { getReportCommissions } = apiReportService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_REPORT_COMMISSION", param_payload, pathname],
    queryFn: () => getReportCommissions(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res) return data_res?.list_staff_commission.list_commissions;
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
      label: "Báo cáo hoa hồng",
      fn: () => {
        setPopup(true);
        setContent("báo cáo hao hồng");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile('report/export-commissions', param_payload)
  }

  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;
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

    searchParams.set("account_id", new_value_params);
    setSearchParams(searchParams);
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
    let account_id: any = []
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;
    const formattedMonth = param_payload?.month ? getFormattedMonthFromNumber(param_payload.month) : month;

    if (account.length > 0) {
      account_id = param_payload?.account_id ? convertStringToArray(param_payload.account_id) : account?.map(item => item.value);
    }
    setFormData(prev => ({ ...prev, month: formattedMonth, person_in_charge: account_id }))
  }, [param_payload, account])

  return (
    <>
      <Box className="relative flex flex-col">
        <div></div>
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
                  width: "calc(25% - 8px)",
                }}
                label="Nhân viên"
                name="person_in_charge"
                handleChange={handleOnchange}
                values={formData}
                options={account}
                errors={errors}
                validate={{}}
                itemsPerPage={5}
                type="select-multi"
              />
            </div>
            <div className="wrapper-from">
              <StatusCardV2
                statusData={{
                  label: "Tổng nhân viên",
                  value: data?.data?.total_staff,
                  color: "#217732",
                }}
                customCss="min-w-[250px]"
              />
              <StatusCardV2
                statusData={{
                  label: "Tổng tiền hoa hồng",
                  value: `${data && formatCurrencyNoUnit(data?.data?.total_commission)} vnđ`,
                  color: "#7A52DE",
                }}
                customCss="min-w-[250px]"
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
