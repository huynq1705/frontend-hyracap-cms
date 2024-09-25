import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Table,
  Pagination,
  PaginationProps,
  Tooltip,
  Empty,
} from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
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
import { formatCurrency } from "@/utils";
import usePermissionCheck from "@/hooks/usePermission";
// import SearchBoxTable from "./search-box-table";
import ActionButton from "@/components/button/action";
import { KeySearchType } from "@/types/types";
import {
  convertObjToParam,
  handleGetPage,
  parseQueryParams,
} from "@/utils/filter";
import apiCustomerService from "@/api/apiCustomer.service";
import { formatDate } from "@/utils/date-time";
import MyTextField from "@/components/input-custom-v2/text-field";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import ButtonCore from "@/components/button/core";
import { useDispatch, useSelector } from "react-redux";
import ModalEdit from "./ModalEdit";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import moment from "moment";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import SearchBoxTable from "@/components/search-box-table";
import { selectPage } from "@/redux/selectors/page.slice";
import { setTotalItems } from "@/redux/slices/page.slice";
import StatusCard from "@/components/status-card";
import apiCommonService from "@/api/apiCommon.service";
import StatusCardV2 from "@/components/status-card/index-v2";
import EmptyIcon from "@/components/icons/empty";
import CPagination from "@/components/pagination";
interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
}
const CustomCardList = ({ dataConvert, actions }: any) => {
  const { hasPermission } = usePermissionCheck("customer");
  const navigate = useNavigate();

  return (
    <div className="flex md:hidden flex-col space-y-4">
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
            <span className="font-medium text-gray-9 text-sm">Mã KH</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Họ và tên</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.full_name ?? "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Số điện thoại
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.phone_number ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Ngày sinh</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.date_of_birth ? formatDate(item?.date_of_birth, "DDMMYYYY") : "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tổng chi tiêu</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.total_spending ?? 0)}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">NV phụ trách</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.account_customer
                .map((it: any) => it?.account?.full_name)
                .join(",") ?? '- -'}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Hạng</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.customer_classification?.rank ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Nguồn KH</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.customer_source?.name ?? "- -"}</span>
            </div>
          </div>

          {(hasPermission.update || hasPermission.delete) && (
            <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
              <span className="font-medium text-gray-9 text-sm">Thao tác</span>
              <div className="text-gray-9 text-base py-1">
                <div className="flex items-center g-8 justify-start space-x-4">
                  {hasPermission.getDetail && (
                    <ActionButton
                      type="view"
                      onClick={() => {
                        navigate(`/admin/customer/view/${item?.id}`);
                        actions.togglePopup("edit");
                      }}
                    />
                  )}
                  {hasPermission.update && (
                    <ActionButton
                      type="edit"
                      onClick={() => {
                        navigate(`/admin/customer/edit/${item?.id}`);
                        actions.togglePopup("edit");
                      }}
                    />
                  )}
                  {hasPermission.delete && (
                    <ActionButton
                      type="remove"
                      onClick={() => {
                        actions.openRemoveConfirm("remove", item?.id);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
const getColumns = (props: ColumnProps) => {
  const navigate = useNavigate();
  const { T } = useCustomTranslation();
  //permissions
  const { hasPermission } = usePermissionCheck("product");

  const { actions } = props;
  const columns: any = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
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
      ),
      width: 50,
    },
    {
      title: "Mã khách hàng",
      dataIndex: "id",

      render: (_: any, item: any, index: number) => (
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
      ),
      width: 120,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      fixed: "left" as const,
      render: (_: any, item: any) => (
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {item?.full_name ?? "- -"}
        </Typography>
      ),
      width: 220,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 120,
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: 400,
            color: "var(--text-color-three)",
          }}
        >
          {d?.phone_number}
        </Typography>
      ),
    },
    {
      width: 120,
      title: "Ngày sinh",
      dataIndex: "col-4",
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.date_of_birth ? formatDate(d?.date_of_birth, "DDMMYYYY") : "- -"}
        </Typography.Text>
      ),
    },
    {
      width: 160,
      title: "Tổng tiền chi tiêu",
      dataIndex: "col-6",
      render: (_: any, d: any) => (
        <Typography.Text>
          {formatCurrency(d?.total_spending ?? 0)}
        </Typography.Text>
      ),
    },
    {
      title: "NV phụ trách",
      dataIndex: "active",
      width: 300,
      render: (_: any, d: any) => {
        const tooltip = d?.account_customer
          .map((it: any) => it?.account?.full_name)
          .join(",");
        const content =
          tooltip.length > 20 ? tooltip.slice(0, 30) + "..." : tooltip;
        return (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            <Tooltip placement="topLeft" title={tooltip}>
              {content}
            </Tooltip>
          </Typography>
        );
      },
    },
    {
      width: 160,
      title: "Hạng",
      dataIndex: "col-6",
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.customer_classification?.rank ?? "- -"}
        </Typography.Text>
      ),
    },
    {
      width: 160,
      title: "Nguồn KH",
      dataIndex: "col-7",
      render: (_: any, d: any) => (
        <Typography.Text>{d?.customer_source?.name ?? "- -"}</Typography.Text>
      ),
    },
  ];
  {
    (hasPermission.update || hasPermission.delete) &&
      columns.push({
        title: T("action"),
        width: 100,
        dataIndex: "actions",
        fixed: "right" as const,
        render: (_: any, d: any) => (
          <>
            {/* check permission */}
            {true && (
              <Stack
                direction={"row"}
                sx={{
                  gap: "12px",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {hasPermission.getDetail && (
                  <ActionButton
                    type="view"
                    onClick={() => {
                      navigate(`/admin/customer/view/${d?.id}`);
                      actions.togglePopup("edit");
                    }}
                  />
                )}
                {hasPermission.update && (
                  <ActionButton
                    type="edit"
                    onClick={() => {
                      navigate(`/admin/customer/edit/${d?.id}`);
                      actions.togglePopup("edit");
                    }}
                  />
                )}
                {hasPermission.delete && (
                  <ActionButton
                    type="remove"
                    onClick={() => {
                      actions.openRemoveConfirm("remove", d?.id);
                    }}
                  />
                )}
              </Stack>
            )}
          </>
        ),
      });
  }
  return columns;
};
const VALIDATE = {
  full_name: "Hãy nhập tên khách hàng",
  phone_number: "Hãy nhập đúng số điện thoại",
};
const KEY_REQUIRED = ["full_name", "phone_number"];

const INIT_CUSTOMER = {
  full_name: "",
  phone_number: "",
  date_of_birth: "",
};

const CTable = () => {
  const { code } = useParams();
  const userInfo = useSelector(selectUserInfo);
  const page = useSelector(selectPage);
  const [searchParams] = useSearchParams();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // -- fn
  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["page"]) params["page"] = 1;
    if (!params["take"]) params["take"] = 10;
    return params;
  };

  const togglePopup = (params: keyof typeof popup, value?: boolean) => {
    setPopup((prev) => ({ ...prev, [params]: value ?? !prev[params] }));
  };
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: currentPage,
      take: pageSize,
      text: keySearch?.text?.toString().trim(),
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOnchange = (e: any) => {
    if (!e?.target) return;
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const disableFutureDates = (current: moment.Moment | null) => {
    return current && current > moment().endOf("day");
  };
  const { postCustomerOrder } = apiCustomerService();

  const handleSubmit = async () => {
    try {
      const response = await postCustomerOrder(formData, KEY_REQUIRED);
      if (!response?.isValid && response?.missingKeys) {
        setErrors(response.missingKeys);
        dispatch(
          setGlobalNoti({
            type: "info",
            message: "Nhập đẩy đủ dữ liệu",
          }),
        );
        return;
      }
      const IS_SUCCESS = !response?.missingKeys && response.statusCode === 200;
      let message =
        `Tạo khách hàng ` + (IS_SUCCESS ? "thành công" : "thất bại");
      let type = IS_SUCCESS ? "success" : "error";
      if (
        response.statusCode === 409 &&
        response?.error[0]?.includes("email")
      ) {
        message = "Email này đã được đăng kí";
        type = "info";
      }
      if (
        response.statusCode === 409 &&
        response?.error[0]?.includes("phone_number")
      ) {
        message = "Số điện thoại này đã được đăng kí";
        type = "info";
      }
      if (IS_SUCCESS) {
        setFormData(INIT_CUSTOMER);
        setErrors([]);
        refetch();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "createError",
        }),
      );
    }
  };
  const getCountCustomerBirthdayToday = async () => {
    try {
      const response: any = await getCustomer({
        page: 1,
        take: 999,
        birthday_today: "1",
      });
      if (response?.meta?.itemCount) setBirthdayToday(response.meta.itemCount);
    } catch (err) { }
  };
  const handelGetStatistics = async () => {
    try {
      const response = await getStatistics("customer/statistical");
      if (response.statusCode === 200) {
        setStatistical(response.data);
      }
    } catch (error) {
      throw error;
    }
  };
  const handleClickFilter = (value: any) => {
    setFilter(filter == value ? null : value);

    navigate(
      filter != value
        ? `/admin/customer?page=1&take=10&type_customer_new=${value}`
        : "/admin/customer?page=1&take=10",
    );
  };
  // -- const
  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
  const { getCustomer } = apiCustomerService();
  const { getStatistics } = apiCommonService();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  const isSearchBirthday = useMemo(() => {
    return search.includes("birthday_today");
  }, [search]);
  // -- state
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
    create_category: false,
  });
  const [keySearch, setKeySearch] = useState<KeySearchType>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [birthdayToday, setBirthdayToday] = useState(0);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["GET_CUSTOMER", param_payload, pathname],
    queryFn: () => getCustomer(param_payload),
    keepPreviousData: true,
  });
  const dataConvert = useMemo(() => {
    if (data && data?.meta) {
      dispatch(setTotalItems(data?.meta?.itemCount ?? 1));
    }

    if (isSearchBirthday) setBirthdayToday(data?.meta?.itemCount ?? 1);

    const data_res = data?.data;
    if (data_res && Array.isArray(data_res))
      return data_res.map((item) => ({ ...item, key: item?.id }));
    return [];
  }, [data, pathname]);
  const selectedRowLabels = useMemo(() => {
    return dataConvert
      .filter((item) => selectedRowKeys.includes(item.key))
      .map((item) => item.full_name);
  }, [selectedRowKeys]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState(INIT_CUSTOMER);
  const [statistical, setStatistical] = useState({
    new_customers: 0,
    seven_day: 0,
    two_week: 0,
    one_month: 0,
  });
  const text_search = useMemo(
    () => keySearch?.text?.toString() ?? "",
    [keySearch?.text, pathname],
  );
  const [filter, setFilter] = useState<any>(null);
  // effect
  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
    getCountCustomerBirthdayToday();
    handelGetStatistics();
    if (!code && !pathname.includes("create")) return;
    if (pathname.includes("create")) {
      togglePopup("edit");
      return;
    }
  }, [window.location.href]);

  return (
    <>
      {/* top table */}
      <Box className="h-full">
        {/* search */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h4>Thêm nhanh khách hàng</h4>
          <div className="gap-4 md:flex items-end mt-2.5 pb-2">
            <MyTextField
              label="Tên khách hàng"
              errors={errors}
              required={KEY_REQUIRED}
              configUI={{}}
              name="full_name"
              placeholder="Khách hàng"
              handleChange={handleOnchange}
              values={formData}
              validate={VALIDATE}
            />
            {/*  */}
            <MyDatePicker
              label={"Ngày sinh"}
              errors={errors}
              required={KEY_REQUIRED}
              configUI={{}}
              name="date_of_birth"
              placeholder="Chọn"
              handleChange={handleOnchangeDate}
              values={formData}
              validate={VALIDATE}
              disabled={false}
              disabledDate={disableFutureDates}
            />
            {/* name */}
            <MyTextField
              label="Số điện thoại"
              errors={errors}
              required={KEY_REQUIRED}
              configUI={{}}
              name="phone_number"
              placeholder="Số điện thoại"
              handleChange={handleOnchange}
              values={formData}
              validate={VALIDATE}
            />
            <div className="mb-2">
              <ButtonCore title={"Thêm mới"} onClick={handleSubmit} />
            </div>
          </div>
        </div>
        {/* content */}
        <Box className="custom-table-wrapper shadow">
          <div className="md:flex items-end  justify-between space-y-4 flex-wrap">
            {/* <div className=""> */}
            <div className="w-full md:w-1/3">
              <SearchBoxTable
                keySearch={text_search}
                setKeySearch={(value?: string) => {
                  setKeySearch((prev) => ({
                    ...prev,
                    text: value ?? "",
                  }));
                }}
                handleSearch={handleSearch}
                placeholder="Tìm theo tên KH, NV phụ trách, sdt"
              />
            </div>
            {/* </div> */}
            <Box
              className="w-fit flex items-center gap-2 p-2 bg-[rgba(253, 246, 254, 0.95)] rounded-lg cursor-pointer"
              sx={{
                border: "1px solid #D444F1",
                mb: 2,
              }}
              onClick={() => {
                navigate(
                  isSearchBirthday
                    ? "/admin/customer"
                    : "/admin/customer?page=1&take=10&birthday_today=1",
                );
              }}
            >
              <p className="text-[#D444F1] text-sm font-semibold">
                {!isSearchBirthday ? "Xem KH sinh nhật hôm nay" : "Xem tất cả"}
              </p>
              <div className="bg-[#F04438] w-6 h-6 rounded-full flex justify-center items-center text-white text-xs">
                {birthdayToday}
              </div>
            </Box>
            {/*  */}
            <div className="w-full flex gap-4 flex-wrap">
              <StatusCardV2
                statusData={{
                  label: "Khách hàng mới",
                  value: statistical.new_customers,
                  color: "#50945D",
                }}
                hightLine="label"
                customCss="max-sm:w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                active={filter == 0}
                onClick={() => {
                  handleClickFilter(0);
                }}
              />
              <StatusCardV2
                statusData={{
                  label: "7+ ngày",
                  value: statistical.seven_day,
                  color: "#0D63F3",
                }}
                hightLine="label"
                customCss="max-sm:w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                active={filter == 1}
                onClick={() => {
                  handleClickFilter(1);
                }}
              />

              <StatusCardV2
                statusData={{
                  label: "15+ ngày",
                  value: statistical.two_week,
                  color: "#F79009",
                }}
                hightLine="label"
                customCss="max-sm:w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                active={filter == 2}
                onClick={() => {
                  handleClickFilter(2);
                }}
              />
              <StatusCardV2
                statusData={{
                  label: "30+ ngày",
                  value: statistical.one_month,
                  color: "#D83D32",
                }}
                hightLine="label"
                customCss="max-sm:w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                active={filter == 3}
                onClick={() => {
                  handleClickFilter(3);
                }}
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
          {/* web */}
          <Table
            size="middle"
            bordered
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
            loading={isLoading}
            dataSource={dataConvert}
            columns={getColumns({
              actions,
            })}
            pagination={false}
            scroll={{ x: "100%" }}
            className="custom-table hidden md:block"
          />

          {/* mobile */}
          <CustomCardList dataConvert={dataConvert} actions={actions} />
          {dataConvert.length < 1 && (
            <Empty
              className="hidden max-sm:block w-full justify-center items-center"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Box>
      </Box>

      {/* popup */}
      <ModalEdit open={popup.edit} toggle={togglePopup} refetch={refetch} />
      <PopupConfirmRemove
        listItem={selectedRowKeys}
        open={popup.remove}
        handleClose={() => {
          togglePopup("remove");
        }}
        refetch={refetch}
        name_item={selectedRowLabels}
      />
      <PopupConfirmImport
        open={popup.upload}
        handleClose={() => {
          togglePopup("upload");
        }}
        refetch={refetch}
      />
    </>
  );
};

export default CTable;
