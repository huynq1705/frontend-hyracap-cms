import React, { useState, useEffect, useMemo } from "react";
import BoxCard from "../component/box-card";
import HeaderReport from "../component/header";
import { Box } from "@mui/material";
import PopupPopupConfirm from "../component/popup-confirm";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import apiReportService from "@/api/apiReport";
import { useQuery } from "@tanstack/react-query";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import { formatCurrencyNoUnit, getFormattedMonthFromNumber } from "@/utils";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import type { Moment } from 'moment';
import moment from "moment";

const currentYear = moment().year();
const disabledDate = (current: Moment | null): boolean => {
  return current ? current.year() !== currentYear : false;
};
export default function ReportRevenuePage() {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState(REPORT_REVENUE);
  const [dataPaymentMethod, setDataPaymentMethod] = useState<any>({});
  const { getReportRevenue, getReportPaymentMethod } = apiReportService();

  const handleGetParam = () => {
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;

    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["month"]) params["month"] = month;
    if (!params["executor_staff_id"]) params["executor_staff_id"] = undefined;
    if (!params["contact_staff_id"]) params["contact_staff_id"] = undefined;
    if (!params["customer_source_id"]) params["customer_source_id"] = undefined;
    if (!params["payment_method_id"]) params["payment_method_id"] = undefined;

    return params;
  };

  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_ACCOUNT_REVENUE", param_payload, pathname],
    queryFn: () => getReportRevenue(param_payload),
    keepPreviousData: true,
  });

  const fetchReportRevenuePaymentMethod = async (month_input?: number) => {
    getReportPaymentMethod(
      param_payload
    ).then((res) => {
      if (res.data) {
        setDataPaymentMethod(res.data);
      }
    }).catch(e => {
    });
  };

  useEffect(() => {
    if (param_payload?.month) {
      fetchReportRevenuePaymentMethod(+param_payload.month);
      const formattedMonth = getFormattedMonthFromNumber(+param_payload.month);
      setFormData(prev => ({ ...prev, month: formattedMonth }))
    }
  }, [param_payload])

  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res)
      return data_res
  }, [data]);

  const totalPayment = useMemo(() => {
    if (dataConvert && Object.keys(dataConvert).length > 0) {
      return Object.values(dataConvert).reduce(
        (sum, item: any) => sum + (item.total_payment || 0),
        0
      );
    }
    return 0;
  }, [dataConvert]);

  const totalPaymentAmount = useMemo(() => {
    if (dataConvert && Object.keys(dataConvert).length > 0) {
      return Object.values(dataConvert).reduce(
        (sum, item: any) => sum + (item.total_payment_amount || 0),
        0
      );
    }
    return 0;
  }, [dataConvert]);

  const arrayButtonExport = [
    {
      label: "Doanh thu đơn hàng",
      fn: () => {
        setPopup(true);
        setContent("báo cáo doanh thu đơn hàng");
      },
    },
    {
      label: "Doanh thu thẻ dịch vụ",
      fn: () => {
        setPopup(true);
        setContent("báo cáo thẻ dịch vụ");
      },
    },
  ];
  const FAKE_DATA = [
    {
      title: "Sản phẩm",
      title_detail: "Xem báo cáo chi tiết",
      fn: () => { navigate("/admin/report-product"); },
      dataRowCard: [
        {
          label: "Tổng lượt thanh toán",
          value: dataConvert?.product?.total_payment.toString() ?? "0",
          color: "#7A52DE",
        },
        {
          label: "Tổng tiền thanh toán",
          value: `${dataConvert ? formatCurrencyNoUnit(dataConvert?.product?.total_payment_amount) : "0"} vnđ`,
          color: "#217732",
        },
      ],
    },
    {
      title: "Dịch vụ",
      title_detail: "Xem báo cáo chi tiết",
      fn: () => { navigate("/admin/report-service"); },
      dataRowCard: [
        {
          label: "Tổng lượt thanh toán",
          value: dataConvert?.service?.total_payment.toString() ?? "0",
          color: "#7A52DE",
        },
        {
          label: "Tổng tiền thanh toán",
          value: `${dataConvert ? formatCurrencyNoUnit(dataConvert?.service?.total_payment_amount) : "0"} vnđ`,
          color: "#217732",
        },
      ],
    },
    {
      title: "Thẻ trả trước",
      title_detail: "Xem báo cáo chi tiết",
      fn: () => { navigate("/admin/report/prepaid_card"); },
      dataRowCard: [
        {
          label: "Tổng lượt thanh toán",
          value: dataConvert?.prepaid_card?.total_payment.toString() ?? "0",
          color: "#7A52DE",
        },
        {
          label: "Tổng số tiền mua thẻ",
          value: `${dataConvert ? formatCurrencyNoUnit(dataConvert?.prepaid_card?.total_payment_amount) : "0"} vnđ`,
          color: "#217732",
        },
        {
          label: "Tổng tiền đã sử dụng",
          value: `${dataConvert ? formatCurrencyNoUnit(dataConvert?.prepaid_card?.total_amount_paid) : "0"} vnđ`,
          color: "#217732",
        },
      ],
    },
    {
      title: "Thẻ liệu trình",
      title_detail: "Xem báo cáo chi tiết",
      fn: () => { navigate("/admin/report/treatments"); },
      dataRowCard: [
        {
          label: "Tổng lượt thanh toán",
          value: dataConvert?.treatment_card?.total_payment.toString() ?? "0",
          color: "#7A52DE",
        },
        {
          label: "Tổng số tiền mua thẻ",
          value: `${dataConvert ? formatCurrencyNoUnit(dataConvert?.treatment_card?.total_payment_amount) : "0"} vnđ`,
          color: "#217732",
        },
        {
          label: "Tổng số lượt sử dụng",
          // value: `${dataConvert && formatCurrencyNoUnit(dataConvert?.treatment_card?.total_amount_paid)} vnđ`,
          value: dataConvert?.treatment_card?.total_amount_paid.toString() ?? "0",
          color: "#217732",
        },
      ],
    },
    {
      title: "Tổng cộng",
      dataRowCard: [
        {
          label: "Tổng lượt thanh toán",
          value: totalPayment ?? "0",
          color: "#7A52DE",
        },
        {
          label: "Tổng tiền thanh toán",
          value: `${formatCurrencyNoUnit(totalPaymentAmount)} vnđ`,
          color: "#217732",
        },
        {
          label: "Tổng tiền đã nộp",
          value: `${dataConvert ? formatCurrencyNoUnit(dataConvert?.prepaid_card?.total_amount_paid) : "0"} vnđ`,
          color: "#217732",
        },
      ],
    },
  ];
  const FAKE_DATA_1 = [
    {
      title: "Tổng tiền thanh toán",
      title_detail: "Xem báo cáo chi tiết",
      fn: () => { navigate("/admin/report/payment"); },
      dataRowCard: [
        {
          label: "Thẻ trả trước",
          value: `${dataPaymentMethod && formatCurrencyNoUnit(dataPaymentMethod?.prepaid_card)} vnđ`,
          color: "#217732",
        },
        {
          label: "Thẻ liệu trình",
          value: `${dataPaymentMethod && formatCurrencyNoUnit(dataPaymentMethod?.treatment)} vnđ`,
          color: "#217732",
        },
        {
          label: "Chuyển khoản (QR Code)",
          value: `${dataPaymentMethod && formatCurrencyNoUnit(dataPaymentMethod?.bank_transfer)} vnđ`,
          color: "#217732",
        },
        {
          label: "Thẻ ATM/Visa/Master Card",
          value: `${dataPaymentMethod && formatCurrencyNoUnit(dataPaymentMethod?.atm_card)} vnđ`,
          color: "#217732",
        },
        {
          label: "Moto",
          value: `${dataPaymentMethod && formatCurrencyNoUnit(dataPaymentMethod?.moto)} vnđ`,
          color: "#217732",
        },
        {
          label: "Tiền mặt",
          value: `${dataPaymentMethod && formatCurrencyNoUnit(dataPaymentMethod?.cash)} vnđ`,
          color: "#217732",
        },
      ],
    },
  ];

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

  return (
    <>
      <div className="pb-5">
        {/* <HeaderReport arrayButtonExport={arrayButtonExport} /> */}
        <div className="flex flex-wrap items-start gap-3 sm:flex-row justify-between py-6 px-4 ">
        <h2 >Báo cáo doanh thu</h2>
        
      </div>
        <Box
          className=" flex flex-col !h-fit gap-4 mb-4 sm:px-4"
        >
          <Box
            className="py-5 px-4 gap-4 rounded-xl mb-6 "
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              '@media (max-width: 600px)': {
                paddingX: '10px',
              },
            }}
          >
            <div className="wrapper-from flex-wrap flex gap-4 items-start ">
              <MyDatePicker
                label={"Lọc theo thời gian"}
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
                disabledDate={disabledDate}
              />
            </div>

            <BoxCard
              title="1. Doanh thu bán hàng"
              existDetail={false}
              data={FAKE_DATA}
              my_select={true}
            />
            <BoxCard
              title="2. Phương thức thanh toán"
              existDetail={false}
              data={FAKE_DATA_1}
            />
          </Box>
          <PopupPopupConfirm
            open={popup}
            onClose={() => {
              setPopup(false);
            }}
            content={content}
          />
        </Box>
      </div>
    </>
  );
}
