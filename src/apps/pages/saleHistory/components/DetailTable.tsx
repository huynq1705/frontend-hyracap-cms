import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Empty } from "antd";
import { Box } from "@mui/system";
// import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import PopupConfirmImport from "@/components/popup/confirm-import";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Breadcrumb } from "antd";
import { formatCurrency, formatCurrencyNoUnit } from "@/utils";
import usePermissionCheck from "@/hooks/usePermission";
import SearchBoxTable from "@/components/search-box-table";
import ActionButton from "@/components/button/action";
import { Grid, Stack, Tab, useMediaQuery } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { KeySearchType } from "@/types/types";
import {
  convertObjToParam,
  handleGetPage,
  parseQueryParams,
} from "@/utils/filter";
import CStatus from "@/components/status";
import apiCommonService from "@/api/apiCommon.service";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";
import EmptyIcon from "@/components/icons/empty";
import { setTotalItems } from "@/redux/slices/page.slice";
import apiSaleHistoryService from "@/api/apiSaleHistory.service";
import apiContractService from "@/api/apiContract.service";
import apiStaffService from "@/api/apiStaff.service";
import StatusCardV2 from "@/components/status-card/index-v2";
import DateSchedule from "../../dashboard/component/custom-datetime-picker";
import moment from "moment";
import palette from "@/theme/palette-common";
import TopTableCustomV2 from "@/components/top-table-custom-v2";
import { setSubTab } from "@/redux/slices/checkPanigation.slice";

interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
  indexItem: number;
}
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
          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">STT</span>
              <div className="text-gray-9 text-base py-1">
                <span>{index + 1}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Họ và tên</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.staff
                  ? `${item?.staff?.first_name}` +
                    " " +
                    `${item?.staff?.last_name}`
                  : "Nhân viên đã bị xóa"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Email</span>
            <div className="text-gray-9 text-base py-1">
              {item?.staff ? item?.staff?.email : "Nhân viên đã bị xóa"}
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">SĐT</span>
            <div className="text-gray-9 text-base py-1">
              {item?.staff ? item?.staff?.phone : "Nhân viên đã bị xóa"}
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mốc đạt KPI</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(+item?.kpi)}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">KPI thực tế</span>
            <div className="text-gray-9 text-base py-1">
              {formatCurrency(+item?.sales_revenue)}
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thưởng KPI</span>
            <div className="text-gray-9 text-base py-1">
              {formatCurrency(+item?.kpi_bonus)}
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
  const { hasPermission } = usePermissionCheck("sale_history");

  const { actions, indexItem } = props;
  const columns: any = [
    {
      title: "STT",
      dataIndex: "sale_history",

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
            {index + 1 + indexItem}
          </Typography>
        </Stack>
      ),
      width: 50,
    },
    {
      title: "Mã hợp đồng",
      dataIndex: "sale_history",
      fixed: "left" as const,
      render: (_: any, item: any) => (
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--success-color)",
            textDecoration: "underline",
          }}
          onClick={() => {
            navigate(`/admin/contract/view/${item?.id}`);
          }}
        >
          {`${item?.contract_id || ""}`}
        </Typography>
      ),
      width: 220,
    },
    {
      title: `Trạng thái `,
      width: 150,
      dataIndex: "status",
      render: (_: any, d: any) => (
        <Stack
          direction={"row"}
          spacing={"6px"}
          alignItems={"center"}
          borderRadius={4}
          p={1}
          bgcolor={palette.bgPrimary}
          sx={{
            width: "fit-content",
          }}
        >
          <CStatus
            type={(() => {
              switch (d?.status) {
                case 0:
                  return "warning";
                case 1:
                  return "success";
                case 2:
                  return "error";
                case 3:
                  return "error";
                case 4:
                  return "success";
                default:
                  return "error";
              }
            })()}
            name={(() => {
              switch (d?.status) {
                case 0:
                  return "Chờ thanh toán";
                case 1:
                  return "Đang hoạt động";
                case 2:
                  return "Từ chối";
                case 3:
                  return "Hoàn tất";
                case 4:
                  return "Đã rút";
                default:
                  return "error";
              }
            })()}
          />
        </Stack>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "sale_history",
      fixed: "left" as const,
      render: (_: any, item: any) => (
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {item?.user
            ? `${item?.user?.firstName}` + " " + `${item?.user?.lastName}`
            : "Khách hàng đã bị xóa"}
        </Typography>
      ),
      width: 220,
    },
    {
      title: "Vốn",
      dataIndex: "capital",
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
            {formatCurrency(+d?.capital)}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Lợi nhuận hiện tại",
      dataIndex: "current_profit",
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
            {formatCurrency(+d?.current_profit)}
          </Typography>
        </Stack>
      ),
    },
    {
      title: "Thời hạn",
      dataIndex: "duration",
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
            {+d?.duration || 0} tháng
          </Typography>
        </Stack>
      ),
    },
  ];

  return columns;
};

interface DetailSaleHistoryTableProps {
  authorizedPermissions?: any;
}

const DetailSaleHistoryTable = (props: DetailSaleHistoryTableProps) => {
  const { code } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const dispatch = useDispatch();
  // --state
  const page = useSelector(selectPage);
  const [total, setTotal] = useState({
    staffName: "",
    staffPosition: "",
    total_user: 0,
    total_kpi: 0,
    kpi: 0,
    kpi_bonus: 0,
    direct_bonus: 0,
    kpi_bonus_base: 0,
  });

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

  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  // search
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
    create_category: false,
  });
  // search
  const [keySearch, setKeySearch] = useState<KeySearchType>({});

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { getSaleHistory, getDetailSaleHistory } = apiSaleHistoryService();
  const { getContract } = apiContractService();
  const { getDetailStaff } = apiStaffService();
  //permissions
  const { hasPermission } = usePermissionCheck("sale_history");

  const [selectedDateStatistic, setSelectedDateStatistic] = useState(
    moment(param_payload?.effective_from__gt) || moment()
  );
  const date = selectedDateStatistic.startOf("month").format("YYYY-MM-DD");
  const endDate = selectedDateStatistic.endOf("month").format("YYYY-MM-DD");

  const { data: dataStaff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["GET_DETAIL_STAFF", code],
    queryFn: () => getDetailStaff(Number(code) || 0),
  });

  const {
    data: dataDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ["GET_DETAIL_SALE_HISTORY", code, date],
    queryFn: () =>
      getDetailSaleHistory({
        staff_id__eq: code,
        month__eq: date,
      }),
  });
  // : { data: undefined, isLoading: false, isError: false };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_CONTRACT_STAFF", param_payload, dataDetail?.data?.staff_id],
    queryFn: () =>
      getContract({
        ...param_payload,
        staff_id__eq: code,
        effective_from__gt: date,
        effective_from__lt: endDate,
      }),
    keepPreviousData: true,
    enabled: !isLoadingDetail && !isErrorDetail && !!code,
  });

  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data?.data;
    if (data && data?.meta) {
      dispatch(setTotalItems(data?.meta?.itemCount ?? 1));
    }
    if (data_res && Array.isArray(data_res))
      return data_res.map((item) => ({ ...item, key: item?.id }));
    return [];
  }, [data]);

  const selectedRowLabels = useMemo(() => {
    return dataConvert
      .filter((item) => selectedRowKeys.includes(item.key))
      .map((item) => item);
  }, [selectedRowKeys]);
  const togglePopup = (params: keyof typeof popup, value?: boolean) => {
    setPopup((prev) => ({ ...prev, [params]: value ?? !prev[params] }));
  };

  useEffect(() => {
    refetchDetail();
    refetch();
  }, [selectedDateStatistic]);
  // search
  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);

    if (pathname.includes("view") && !popup.edit) {
      navigate(`/admin/sale_history/view/${code}`);
      togglePopup("edit");
    }
  }, [window.location.href]);
  // search
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: currentPage,
      take: pageSize,
      text: keySearch?.text?.toString().trim(),
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };

  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  const text_search = useMemo(
    () => keySearch?.text?.toString() ?? "",
    [keySearch?.text, pathname]
  );
  useEffect(() => {
    if (data?.data && dataDetail?.data) {
      setTotal({
        staffName: dataStaff?.data?.first_name
          ? `${dataStaff?.data?.first_name} ${dataStaff?.data?.last_name} `
          : "",
        staffPosition:
          dataStaff?.data?.current_staff_position?.position?.name || "",
        total_user: data?.meta?.itemCount || 0,
        total_kpi: +dataDetail?.data[0]?.sales_revenue || 0,
        kpi: +dataDetail?.data[0]?.kpi || 0,
        kpi_bonus: +dataDetail?.data[0]?.kpi_bonus || 0,
        direct_bonus: +dataDetail?.data[0]?.direct_bonus || 0,
        kpi_bonus_base:
          +dataDetail?.data[0]?.position_setting?.kpi_bonus_base || 0,
      });
    }
  }, [data]);

  const handleRowClick = (record: any) => {
    // console.log("row", record);
    // navigate(`/admin/sale_history/${record.id}`);
  };

  useEffect(() => {
    refetch();
  }, [window.location.href]);

  const [subTabSchedule, setSubTabSchedule] = useState("1");
  const handleChangeSubTab = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setSubTabSchedule(newValue);
  };

  useEffect(() => {
    if (subTabSchedule === "2") {
      dispatch(setSubTab(true));
    } else {
      dispatch(setSubTab(false));
    }
  }, [subTabSchedule, pathname, dispatch]);
  return (
    <Stack className="h-auto">
      <Box className="h-full p-4 gap-4 flex flex-col">
        <Breadcrumb
          items={[
            {
              title: (
                <p
                  onClick={() => navigate("/admin/sale_history")}
                  className="cursor-pointer hover:underline"
                >
                  Báo cáo hoa hồng
                </p>
              ),
            },
            {
              title: total?.staffName,
            },
          ]}
        />
        <Box className="custom-table-wrapper shadow">
          <TabContext value={subTabSchedule}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "#fff",
              }}
            >
              <TabList
                onChange={handleChangeSubTab}
                aria-label="lab API tabs example"
              >
                <Tab label="Hoa hồng" value="1" />
                {/* <Tab label="Thông tin cá nhân" value="2" /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="flex flex-col gap-2">
                <div className="md:flex items-start flex-col  justify-between space-y-4 flex-wrap">
                  <div className="w-full md:w-1/3">
                    <TopTableCustomV2
                      title={`${total?.staffName}`}
                      description={`${total?.staffPosition}`}
                    />
                  </div>
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
                      placeholder="Tìm theo mã hợp đồng"
                    />
                  </div>
                </div>
                {search.includes("text") && key_search?.text && (
                  <div>
                    {dataConvert.length
                      ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.text}'`
                      : `Không tìm thấy nội dung nào phù hợp với '${key_search?.text}'`}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="wrapper-from">
                    <StatusCardV2
                      statusData={{
                        label: "Số lượng hợp đồng",
                        value: total.total_user,
                        color: "#217732",
                      }}
                      customCss="min-w-[250px]"
                    />
                    <StatusCardV2
                      statusData={{
                        label: "KPI",
                        value: `${
                          data && formatCurrencyNoUnit(+total.kpi)
                        } vnđ`,
                        color: "#7A52DE",
                      }}
                      customCss="min-w-[250px]"
                    />
                    <StatusCardV2
                      statusData={{
                        label: "Mức thưởng KPI",
                        value: `${
                          data && formatCurrencyNoUnit(+total.kpi_bonus_base)
                        } vnđ`,
                        color: "#7A52DE",
                      }}
                      customCss="min-w-[250px]"
                    />
                    <StatusCardV2
                      statusData={{
                        label: "Tổng tiền doanh thu",
                        value: `${
                          data && formatCurrencyNoUnit(+total.total_kpi)
                        } vnđ`,
                        color: "#7A52DE",
                      }}
                      customCss="min-w-[250px]"
                    />
                    <StatusCardV2
                      statusData={{
                        label: "Thưởng KPI",
                        value: `${
                          data && formatCurrencyNoUnit(+total.kpi_bonus)
                        } vnđ`,
                        color: "#7A52DE",
                      }}
                      customCss="min-w-[250px]"
                    />
                    <StatusCardV2
                      statusData={{
                        label: "Thưởng trực tiếp",
                        value: `${
                          data && formatCurrencyNoUnit(+total.direct_bonus)
                        } vnđ`,
                        color: "#7A52DE",
                      }}
                      customCss="min-w-[250px]"
                    />
                  </div>
                  <div className="items-end">
                    <DateSchedule
                      selectedDate={selectedDateStatistic}
                      setSelectedDate={setSelectedDateStatistic}
                    />
                  </div>
                </div>
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
                  // rowSelection={() => {
                  //   console.log("selection");
                  // }}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                  })}
                  loading={isLoading}
                  dataSource={dataConvert}
                  columns={getColumns({
                    actions,
                    indexItem: pageSize * (currentPage - 1),
                  })}
                  pagination={false}
                  scroll={{ x: "100%" }}
                  className="custom-table custom-table hidden md:block"
                  rowClassName={"cursor-pointer"}
                />

                {/* mobile */}
                <CustomCardList dataConvert={dataConvert} actions={actions} />
                {dataConvert.length < 1 && (
                  <Empty
                    className="hidden max-sm:block w-full justify-center items-center"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div> </div>
            </TabPanel>
          </TabContext>
        </Box>
      </Box>

      {/*  */}
      <PopupConfirmImport
        open={popup.upload}
        handleClose={() => {
          togglePopup("upload");
        }}
        refetch={refetch}
      />
    </Stack>
  );
};

export default DetailSaleHistoryTable;
