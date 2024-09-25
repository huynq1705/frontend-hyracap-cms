import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Tooltip, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
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
import { KeySearchType, OptionSelect } from "@/types/types";
import apiPrepaidCardFaceValueService from "@/api/apiPrepaidCardFaceValue.service";
import CStatus from "@/components/status";
import apiOrderService from "@/api/apiOrder.service";
import { formatDate } from "@/utils/date-time";
import StatusCardV2 from "@/components/status-card/index-v2";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import MySelect from "@/components/input-custom-v2/select";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import { handleGetDataCommon } from "@/utils/fetch";
import apiAccountService from "@/api/Account.service";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import apiPaymentMethodsService from "@/api/apiPaymentMethods.service";
import EmptyIcon from "@/components/icons/empty";
import { setNavOpen } from "@/redux/slices/navigation.slice";
import { useDispatch } from "react-redux";

interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
}
const dateFormat = "YYYY-MM-DD";
const CustomCardList = ({ dataConvert, actions }: any) => {
  const { hasPermission } = usePermissionCheck("customer");
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
            <span className="font-medium text-gray-9 text-sm">Mã đơn hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tên khách hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.customer?.full_name.length > 20 ? 
                item?.customer?.full_name.slice(0, 30) + "..." :
                item?.customer?.full_name ? item?.customer?.full_name:
                "Khách lẻ"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Sđt Khách hàng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.customer?.phone_number ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thời gian thanh toán</span>
            <div className="text-gray-9 text-base py-1">
              <span>
              {formatDate(item?.created_at, "DDMMYYYY")}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thu ngân</span>
            <div className="text-gray-9 text-base py-1">
            <Tooltip placement="topLeft" title={'k'}>
              {/* {content} */}
            </Tooltip>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">PTTT</span>
            <div className="text-gray-9 text-base py-1">
              <span>momo</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Số tiền thanh toán</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.total)}</span>
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
      title: "Thời gian thanh toán",
      dataIndex: "price",
      render: (_: any, d: any) => (
        <Typography.Text>
          {formatDate(d?.created_at, "DDMMYYYY")}
        </Typography.Text>
      ),
    },
    {
      title: "Thu ngân",
      dataIndex: "active",
      width: 300,
      render: (_: any, d: any) => {
        // const tooltip = d?.account_order
        //   .map((it: any) => it?.account?.full_name)
        //   .join(",");
        // const content =
        //   tooltip.length > 20 ? tooltip.slice(0, 30) + "..." : tooltip;
        return (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            <Tooltip placement="topLeft" title={'k'}>
              {/* {content} */}
            </Tooltip>
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
            momo
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
            {formatCurrency(d?.total)}
          </Typography>
        </Stack>
      ),
    },
  ];
  return columns;
};

const CTableOder = () => {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // search
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
  const { currentPage, pageSize } = handleGetPage();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  // search
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
  });
  // search
  const [keySearch, setKeySearch] = useState<KeySearchType>({});
  const [flagSearch, setFlagSearch] = useState(false);
  // search
  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });
  // PREPAID_CARD_FACE_VALUE;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { getOrder } = apiOrderService();
  //permissions
  const { hasPermission } = usePermissionCheck("order");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_ORDER", param_payload, pathname],
    queryFn: () => getOrder(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data_res && Array.isArray(data_res))
      return data_res.map((item) => ({ ...item, key: item?.id }));
    return [];
  }, [data]);
  const selectedRowLabels = useMemo(() => {
    return dataConvert
      .filter((item) => selectedRowKeys.includes(item.key))
      .map((item) => item?.key);
  }, [selectedRowKeys]);
  const togglePopup = (params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  };
  const hasSelected = selectedRowKeys.length > 0;
  useEffect(() => {
    if (data && data?.meta) {
      setPage((prev) => ({
        ...prev,
        totalItem: data?.meta?.itemCount ?? 1,
      }));
      // Update total items from API response
    }
  }, [data]);
  // search
  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
  }, []);
  useEffect(() => {
    if (flagSearch) handleSearch();
  }, [flagSearch]);
  // search
  useEffect(() => {
    if (!code && !pathname.includes("create")) return;
    if (pathname.includes("view")) {
      navigate(`/admin/prepaid-card-face-value/view/${code}`);
      togglePopup("edit");
    }
    if (pathname.includes("create")) {
      togglePopup("edit");
      return;
    }
  }, []);
  // search
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: page.currentPage,
      take: page.pageSize,
    });
    let url = `${pathname}${filter}`;
    setFlagSearch(false);
    navigate(url);
  };

  // search
  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    setPage((prev) => ({ ...prev, currentPage: pageNumber }));
    setFlagSearch(true);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    setPage((prev) => ({ ...prev, pageSize }));
    setFlagSearch(true);
  };
  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  const { getAccount } = apiAccountService();
  const { getCustomerSource } = apiCustomerSourceService();
  const { getPaymentMethods } = apiPaymentMethodsService();
  const [formData, setFormData] = React.useState(REPORT_REVENUE);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [account, setAccount] = React.useState<OptionSelect>([]);
  const [customerSource, setCustomerSource] = React.useState<OptionSelect>([]);
  const [paymentMethods, setPaymentMethods] = React.useState<OptionSelect>([]);
  const [customerClassification, setCustomerClassification] = React.useState<OptionSelect>([]);

  const initData = () => {
    const convert_account = (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        value: item.id.toString(),
        label: item.full_name,
      }));
    };
    const convert = (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name ?? item.rank,
      }));
    };
    handleGetDataCommon(getAccount, convert_account, setAccount);
    handleGetDataCommon(getCustomerSource, convert, setCustomerSource);
    handleGetDataCommon(getPaymentMethods, convert, setPaymentMethods,);
  };

  React.useEffect(() => {
    initData();
    closeNavBar();
  }, []);
  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;
    let convert_value = value;
    setFormData((prev) => ({ ...prev, [name]: convert_value }));
  };
  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const closeNavBar = () => {
    dispatch(setNavOpen(false));
  };
  // const handleOnchange = (e: any) => {
  //   const { name, value, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  return (
    <>
      <Box className="custom-table-wrapper ">
        <div className="wrapper-from flex-wrap flex gap-4 items-start ">
          {/* date_time */}
          <MyDatePicker
            label={"Từ ngày"}
            errors={[]}
            required={[]}
            configUI={{
              width: "calc(16.6% - 13.3px)",
            }}
            name="start_date"
            placeholder="Chọn ngày hẹn"
            handleChange={handleOnchangeDate}
            values={formData}
            validate={{}}
            format={dateFormat}
          />
          <MyDatePicker
            label={"Đến ngày"}
            errors={[]}
            required={[]}
            configUI={{
              width: "calc(16.6% - 13.3px)",
            }}
            name="end_date"
            placeholder="Chọn ngày hẹn"
            handleChange={handleOnchangeDate}
            values={formData}
            validate={{}}
            format={dateFormat}
          />
           <MySelect
            configUI={{
              width: "calc(16.6% - 13.3px)",
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
              width: "calc(16.6% - 13.3px)",
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
              width: "calc(16.6% - 13.3px)",
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
              width: "calc(16.6% - 13.3px)",
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
              value: "13",
              color: "#7A52DE",
            }}
            customCss="min-w-[250px]"
          />
          <StatusCardV2
            statusData={{
              label: "Tổng tiền thanh toán",
              value: "25.000.000 vnđ",
              color: "#217732",
            }}
            customCss="min-w-[250px]"
          />
        </div>
        {/* <Card> */}
        <CustomCardList dataConvert={dataConvert} actions={actions} />
          {dataConvert.length < 1 && <Empty className="hidden max-sm:block w-full justify-center items-center" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
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
    </>
  );
};

export default CTableOder;

