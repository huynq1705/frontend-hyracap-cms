import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
import { render } from "react-dom";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import CSwitch from "@/components/custom/CSwitch";
import usePermissionCheck from "@/hooks/usePermission";
import PopupCreateEmployee from "./PopupCreateEmployee";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
import ActionButton from "@/components/button/action";
import palette from "@/theme/palette-common";
import MySelect from "@/components/input-custom-v2/select";
import apiAccountService from "@/api/Account.service";
import { formatDate } from "@/utils/date-time";
import CStatus from "@/components/status";
import SearchBoxTable from "@/components/search-box-table";
import { KeySearchType } from "@/types/types";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import StatusCard from "@/components/status-card";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { setTotalItems } from "@/redux/slices/page.slice";
import EmptyIcon from "@/components/icons/empty";
import StatusCardV2 from "@/components/status-card/index-v2";
interface ColumnProps {
  refetch?: () => void;
  actions: {
    [key: string]: (...args: any) => void;
  };
  indexItem: number;
}
const CustomCardList = ({ dataConvert, actions }: any) => {
  const { hasPermission } = usePermissionCheck("account");
  const navigate = useNavigate();
  return (
    <div className=" flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item.id}
          className="border border-solid border-gray-4 shadow rounded-lg mb-4"
        >
          {/* <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div> */}

          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Mã nhân viên
              </span>
              <div className="text-gray-9 text-base py-1">
                <span> NV-000{item?.id}</span>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Trạng thái
              </span>
              <div className="text-gray-9 text-base py-1">
                <CStatus
                  type={item?.status ? "success" : "error"}
                  name={item?.status ? "Active" : "Inactive"}
                />
              </div>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Họ và tên</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.full_name ?? "Không có tên"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên đăng nhập
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.username}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Số điện thoại
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.phone_number}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Email</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.email}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Chức vụ</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.position || "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Nhận đặt lịch
            </span>
            <div className="text-gray-9 text-base py-1">
              <CSwitch
                defaultChecked
                checked={!!item?.is_book_online}
                onClick={() =>
                  actions.onChangeStatus(item.id, item?.is_book_online ? 0 : 1)
                }
              />
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Ngày tham gia
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatDate(item?.created_at, "DDMMYY")}</span>
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
                      // onClick={() => actions.openEditConfirm(true, "detail", d)}
                      onClick={() => {
                        navigate(
                          `/admin/management-employee/detail/${item?.id}/${
                            item?.full_name
                          }/${item?.average_star || 0}`,
                        );
                      }}
                    />
                  )}
                  {hasPermission.update && (
                    <ActionButton
                      type="edit"
                      onClick={() => {
                        navigate(
                          `/admin/management-employee/edit/${item?.id}/${
                            item?.full_name
                          }/${item?.average_star || 0}`,
                        );
                      }}
                    />
                  )}
                  {hasPermission.delete && (
                    <ActionButton
                      type="remove"
                      onClick={() =>
                        actions.openRemoveConfirm(
                          true,
                          item?.id,
                          item?.full_name,
                        )
                      }
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
  // const userInfo = useSelector(selectUserInfo);
  const { T } = useCustomTranslation();
  const { hasPermission } = usePermissionCheck("account");
  const { pathname } = useLocation();
  const { refetch, actions, indexItem } = props;
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
          }}
        >
          {index + 1 + indexItem}
        </Typography.Text>
      ),
      width: 46,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "id",
      width: 160,
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            fontWeight: 400,
            color: palette.textQuaternary,
            textAlign: "left",
          }}
        >
          {d?.id}
        </Typography>
      ),
    },
    {
      title: T("fullName"),
      dataIndex: "full_name",
      width: 182,
      fixed: "left" as const,
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
            textAlign: "left",
          }}
        >
          {d.full_name}
        </Typography>
      ),
    },
    {
      title: T("phone_number"),
      dataIndex: "phone_number",
      width: 143,
      render: (_: any, d: any) => (
        <Typography.Text
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
          }}
        >
          {d?.phone_number}
        </Typography.Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 249,
      // render: (_: any, d: any) => <TransactionStatus d={d} />,
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
            textAlign: "left",
          }}
        >
          {d?.email || "- -"}
        </Typography>
      ),
    },
    {
      title: "Chức vụ",
      width: 130,
      dataIndex: "role",
      render: (_: any, d: any) => (
        <Typography.Text
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
          }}
        >
          {d?.position || "- -"}
        </Typography.Text>
      ),
    },
    {
      title: "Nhận đặt lịch",
      width: 146,
      dataIndex: "is_book_online",
      render: (_: any, d: any) => (
        <Stack>
          <CSwitch
            defaultChecked
            checked={!!d?.is_book_online}
            onClick={() =>
              actions.onChangeStatus(d.id, d?.is_book_online ? 0 : 1)
            }
          />
        </Stack>
      ),
    },
    {
      title: "Ngày tham gia",
      width: 144,
      dataIndex: "created_at",
      render: (_: any, d: any) => (
        <Typography.Text
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
          }}
        >
          {formatDate(d?.created_at, "DDMMYY")}
        </Typography.Text>
      ),
    },
    {
      title: T("status"),
      width: 124,
      dataIndex: "status",
      render: (_: any, d: any) => (
        <Stack
          sx={{
            width: "fit-content",
          }}
        >
          <CStatus
            type={d?.status ? "success" : "error"}
            name={d?.status ? "Active" : "Inactive"}
          />
        </Stack>
      ),
    },
    {
      title: T("action"),
      width: 120,
      dataIndex: "actions",
      fixed: "right" as const,
      shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
      zIndex: 100,
      render: (_: any, d: any) => (
        <>
          {/* check permission */}
          <Stack
            direction={"row"}
            sx={{
              gap: "16px",
              justifyContent: "flex-start",
              alignItems: "center",
              px: "9px",
              boxShadow: "",
            }}
          >
            {hasPermission.getDetail && (
              <ActionButton
                type="view"
                // onClick={() => actions.openEditConfirm(true, "detail", d)}
                onClick={() => {
                  navigate(
                    `/admin/management-employee/detail/${d?.id}/${
                      d?.full_name
                    }/${d?.average_star || 0}`,
                  );
                }}
              />
            )}
            {hasPermission.update && (
              <ActionButton
                type="edit"
                onClick={() => {
                  navigate(
                    `/admin/management-employee/edit/${d?.id}/${d?.full_name}/${
                      d?.average_star || 0
                    }`,
                  );
                }}
              />
            )}
            {hasPermission.delete && (
              <ActionButton
                type="remove"
                onClick={() =>
                  actions.openRemoveConfirm(true, d?.id, d?.full_name)
                }
              />
            )}
          </Stack>
        </>
      ),
    },
  ];
  return columns;
};

interface ListRequestDepositProps {
  authorizedPermissions?: any;
}

const listColor = [
  "#DE8208",
  "#D83D32",
  "#0D63F3",
  "#50945D",
  "#BF3DD9",
  "#667085",
];

const ListEmployeeDeposit = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getAccount, putAccount, getAccountTotal } = apiAccountService();
  const [searchParams] = useSearchParams();
  const { pageSize, key_search, currentPage } = handleGetPage(searchParams);
  const { T,t } = useCustomTranslation();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    remove: false,
    data: { ...INIT_EMPLOYEE, type: 1 },
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });

  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__eq: "",
    type__eq: "1",
    ...key_search,
  });
  const [total, setTotal] = useState([
    {
      label: "Đặt online",
      color: "#875BF7",
      value: 0,
    },
  ]);
  const [keySearchText, setKeySearchText] = useState<any>(key_search.text);

  const param_payload = useMemo(() => {
    return handleGetParam(searchParams, "type__eq__1");
  }, [searchParams]);
  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ["GET_ACCOUNT", param_payload, pathname],
    queryFn: () => getAccount(param_payload),
    keepPreviousData: true,
  });

  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    if (data && data.data && Array.isArray(data.data))
      return data.data.map((item) => ({
        ...item,
        key: item?.id,
        password: "",
      }));
    return [];
  }, [data]);

  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_EMPLOYEE,
  ) => {
    setPopup((prev) => ({
      ...prev,
      remove: params,
      data: data,
      status: status,
    }));
  };
  const handleSubmitUpdate = async (is_book_online: number, code: number) => {
    try {
      const response = await putAccount(
        { is_book_online: is_book_online },
        code,
        [],
        [],
      );
      switch (response) {
        case true: {
          refetch();
          // handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message : T("update") + " " + t("fail")
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("update") + " " + t("fail")
            }),
          );
          break;
        }
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: T("thereWasError"),
        }),
      );
      console.error("==>", error);
    }
  };
  const actions = {
    openEditConfirm: (
      key_popup: boolean,
      status: string,
      code_item: typeof INIT_EMPLOYEE,
    ) => {
      togglePopup(key_popup, status, code_item);
    },
    openRemoveConfirm: (
      key_popup: boolean,
      code_item: string,
      name: string,
    ) => {
      togglePopupRemove(key_popup, code_item, name);
    },
    onChangeStatus: (id: number, is_book_online: number) => {
      handleSubmitUpdate(is_book_online, id);
    },
  };
  const togglePopupRemove = (params: boolean, code: string, name: string) => {
    setPopupRemove((prev) => ({
      ...prev,
      remove: params,
      code: code,
      name: name,
    }));
  };

  const getTotal = () => {
    getAccountTotal()
      .then((e) => {
        if (e.data) {
          let i = 0;
          setTotal(
            e.data.reduce((acc, item) => {
              if (item.position !== null && item.position !== "") {
                acc.push({
                  label: item.position,
                  color: listColor[i],
                  value: item.total,
                });
                i++; // Tăng i sau khi đẩy giá trị vào acc
              }
              return acc;
            }, [] as { label: string; color: string; value: number }[]),
          );
        }
      })
      .catch((e) => {});
  };
  const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  };
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: 1,
      take: pageSize,
      text: keySearchText,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };

  const handleOnChangeSearchStatus = (name: string, value?: string) => {
    let check = name === "position__eq" && keySearch[name] === value;
    setKeySearch({ ...keySearch, [name]: check ? "" : value });
    let filter = convertObjToParam(
      { ...keySearch, [name]: check ? "" : value },
      {
        page: 1,
        take: pageSize,
        text: keySearchText,
      },
    );
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  useEffect(() => {
    setPopup({
      remove: pathname.includes("create"),
      data: { ...INIT_EMPLOYEE, type: 1 },
      status: "create",
    });
  }, [pathname]);
  useEffect(() => {
    getTotal();
  }, [data]);
  const reset = () => {
    setKeySearch({
      ...keySearch,
      status__eq: "",
    });
    // refetch();
    navigate("/admin/management-employee");
  };
  return (
    <>
      <Box width="100%" className="custom-table-wrapper">
        <div className="w-full flex-wrap md:flex items-start justify-start gap-4 ">
          <SearchBoxTable
            keySearch={keySearchText}
            setKeySearch={setKeySearchText}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên, mã nhân viên, sđt"
          />
          <div className="admin-from w-[217px] max-sm:w-full ">
            <MySelect
              options={[
                { label: "ALL", value: "" },
                { label: "Active", value: "1" },
                { label: "Inactive", value: "0" },
              ]}
              label={T("status")}
              errors={[]}
              required={[]}
              name="status__eq"
              placeholder="ALL"
              handleChange={(e) => {
                handleOnChangeSearchStatus(e.target.name, e.target.value);
              }}
              values={keySearch}
              validate={VALIDATE}
              type="select-one"
              itemsPerPage={5}
              // inputStyle={{height:36}}
            />
          </div>
        </div>
        {/* <Card> */}
        <div className="flex-wrap flex gap-4 items-stretch">
          {total.map((item) => (
            <StatusCardV2
              statusData={item}
              hightLine="label"
              active={keySearch["position__eq"] === item.label}
              onClick={() => {
                handleOnChangeSearchStatus("position__eq", item.label);
              }}
              customCss=" max-sm:w-[calc(50%-8px)]"
            />
          ))}
        </div>
        <CustomCardList dataConvert={dataConvert} actions={actions} />
        {dataConvert.length < 1 && (
          <Empty
            className="hidden max-sm:block w-full justify-center items-center"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
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
            indexItem: pageSize * (currentPage - 1),
          })}
          pagination={false}
          scroll={{ x: "100%" }}
          className="custom-table hidden md:block"
          // style={{
          //   height: "calc(100vh - 413px)",
          // }}
        />
        {/* search */}
      </Box>
      {popup.remove && (
        <PopupCreateEmployee
          // listItem={selectedRowKeys}
          status={popup.status}
          handleClose={() =>
            popup.status === "create"
              ? navigate(`/admin/management-employee?${searchParams}`)
              : setPopup((prev) => ({ ...prev, remove: false }))
          }
          refetch={() => {
            if (pathname.includes("create")) {
              reset();
            } else {
              setPopup((prev) => ({ ...prev, remove: false }));
              refetch();
            }
          }}
          data={popup.data}
        />
      )}

      <PopupConfirmRemove
        listItem={[popupRemove.code]}
        // listItem={selectedRowKeys}
        open={popupRemove.remove}
        handleClose={() =>
          setPopupRemove((prev) => ({ ...prev, remove: false }))
        }
        refetch={reset}
        name_item={[popupRemove.name]}
      />
    </>
  );
};

export default ListEmployeeDeposit;
