import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, PaginationProps, Pagination, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import palette from "@/theme/palette-common";
import MySelect from "@/components/input-custom-v2/select";
import apiAccountService from "@/api/Account.service";
import PopupCreateAdmin from "./PopupCreateAdmin";
import { formatDate } from "@/utils/date-time";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
import CStatus from "@/components/status";
import { KeySearchType, OptionSelect } from "@/types/types";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
import SearchBoxTable from "@/components/search-box-table";
import EmptyIcon from "@/components/icons/empty";
interface ColumnProps {
  hasPermissionConfirmed: boolean;
  hasPermissionView: boolean;
  refetch?: () => void;
  actions: {
    [key: string]: (...args: any) => void;
  };
  indexItem: number;
}

const VALIDATE = {
  full_name: "Họ và tên không được chứa kí tự đặc biệt.",
  phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};
const CustomCardList = ({ dataConvert, actions }: any) => {
  const { hasPermission } = usePermissionCheck("service");
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
              <span>{item?.position}</span>
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

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Trạng thái</span>
            <div className="text-gray-9 text-base py-1">
              {/* <span>{item?.customer_classification?.name ?? "- -"}</span>
               */}
              <CStatus
                type={item?.status ? "success" : "error"}
                name={item?.status ? "Active" : "Inactive"}
              />
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
                      onClick={() =>
                        actions.openEditConfirm(true, "detail", item)
                      }
                    />
                  )}
                  {hasPermission.update && (
                    <ActionButton
                      type="edit"
                      onClick={() =>
                        actions.openEditConfirm(true, "edit", item)
                      }
                    />
                  )}
                  {hasPermission.delete && (
                    <ActionButton
                      type="remove"
                      onClick={() =>
                        actions.openRemoveConfirm(true, item?.id, item?.name)
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
  const { T } = useCustomTranslation();
  const { hasPermission } = usePermissionCheck("product");
  const { actions, indexItem } = props;
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
            lineHeight: "22px",
          }}
        >
          {index + 1 + indexItem}
        </Typography>
      ),
      width: 46,
    },
    {
      title: T("fullName"),
      dataIndex: "full_name",
      // fixed: "left" as const,
      render: (_: any, item: any) => (
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"flex-start"}
          sx={{
            alignItems: "center",
            // cursor: "pointer",
          }}
          // onClick={() => navigate(`${pathname}/edit/${item?.sh_code}`)}
        >
          <Stack direction={"column"}>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: 500,
                // color: "var(--text-color-primary)",
              }}
            >
              {item?.full_name ?? "Không có tên"}
            </Typography>
          </Stack>
        </Stack>
      ),
      width: 182,
    },
    {
      title: T("userName"),
      dataIndex: "username",
      width: 240,
      render: (_: any, item: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "left",
            }}
          >
            {item?.username}
          </Typography>
        </Stack>
      ),
    },
    {
      width: 175,
      title: T("phone_number"),
      dataIndex: "phone_number",
      render: (_: any, item: any) => (
        <Typography style={{ textAlign: "left" }}>
          {item?.phone_number}
        </Typography>
      ),
    },
    {
      title: T("email"),
      dataIndex: "email",
      width: 249,
      render: (_: any, item: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "left",
            }}
          >
            {item?.email || "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      title: T("position"),
      dataIndex: "position",
      width: 113,
      render: (_: any, item: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {item?.position || "- -"}
          </Typography>
        </Stack>
      ),
    },
    {
      title: T("joining_date"),
      dataIndex: "create_at",
      width: 144,
      render: (_: any, item: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {formatDate(item?.created_at, "DDMMYY")}
          </Typography>
        </Stack>
      ),
    },
    {
      title: T("status"),
      width: 124,
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
            type={d?.status ? "success" : "error"}
            name={d?.status ? "Active" : "Inactive"}
          />
        </Stack>
      ),
    },
    {
      title: "Thao tác",
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
              // position: 'absolute',
              // right: 0,
              // top: 0,
              // bottom: 0
            }}
          >
            {hasPermission.getDetail && (
              <ActionButton
                type="view"
                onClick={() => actions.openEditConfirm(true, "detail", d)}
              />
            )}
            {hasPermission.update && (
              <ActionButton
                type="edit"
                onClick={() => actions.openEditConfirm(true, "edit", d)}
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

const ListAdmin = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getAccount } = apiAccountService();
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // search
  const [listRole] = React.useState<OptionSelect>([
    { label: "Tất cả", value: "" },
    { label: "Quản lý", value: "Quản lý" },
    { label: "Admin", value: "Admin" },
  ]);
  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_EMPLOYEE,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });
  const [searchParams] = useSearchParams();
  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
  const [keySearchText, setKeySearchText] = useState<any>(key_search.text);
  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__eq: "",
    position__like: "",
    type__eq: "0",
    key_search,
  });
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams, "type__eq__0");
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
  };
  const togglePopupRemove = (params: boolean, code: string, name: string) => {
    setPopupRemove((prev) => ({
      ...prev,
      remove: params,
      code: code,
      name: name,
    }));
  };
  /////search
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: 1,
      take: pageSize,
      text: keySearchText,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };

  const reset = () => {
    setKeySearchText("");

    setKeySearch({
      ...keySearch,
      status__eq: "",
      position__like: "",
    });
    // setPopup((prev) => ({ ...prev, remove: false }));

    navigate("/admin/management-admin");
    // refetch();
  };
  const handleOnChangeSearchStatus = (name: string, value?: string) => {
    setKeySearch({ ...keySearch, [name]: value });
    let filter = convertObjToParam(
      { ...keySearch, [name]: value },
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
      data: INIT_EMPLOYEE,
      status: "create",
    });
  }, [pathname]);
  return (
    <>
      <Box width="100%" className="custom-table-wrapper">
        <div className="w-full flex-wrap md:flex items-start justify-start gap-4 ">
          {/* <div className="max-sm:w-full w-1/3"> */}
          <SearchBoxTable
            keySearch={keySearchText}
            setKeySearch={setKeySearchText}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên, tên đăng nhập, sđt"
          />
          {/* </div> */}

          {/* {flagSearch && keySearch?.name__like && (
            <div>{`Có ${page.totalItem} kết quả cho từ khóa '${keySearch?.name__like}'`}</div>
          )} */}
          <div className="admin-from w-auto sm:min-w-[444px] sm:max-w-[444px] flex justify-start gap-4">
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
              placeholder="- -"
              handleChange={(e) => {
                handleOnChangeSearchStatus(e.target.name, e.target.value);
              }}
              values={keySearch}
              validate={VALIDATE}
              type="select-one"
              itemsPerPage={5}
              // inputStyle={{height:36}}
            />
            <MySelect
              options={listRole}
              label="Chức vụ"
              errors={[]}
              required={[]}
              name="position__like"
              handleChange={(e) => {
                handleOnChangeSearchStatus(e.target.name, e.target.value);
              }}
              values={keySearch}
              validate={VALIDATE}
              type="select-one"
              itemsPerPage={5}
            />
          </div>
        </div>

        {/* <Card> */}
        <CustomCardList dataConvert={dataConvert} actions={actions} />
        {dataConvert.length < 1 && (
          <div
            className=" md:hidden flex justify-center items-center py-20  "
            style={{ borderTop: "2px solid #F2F4F7" }}
          >
            <div className="flex flex-col">
              <EmptyIcon />
              <p className="text-center mt-3">Không có dữ liệu</p>
            </div>
          </div>
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
            refetch,
            hasPermissionConfirmed: authorizedPermissions?.confirmed,
            hasPermissionView: authorizedPermissions?.view,
            actions,
            indexItem: pageSize * (currentPage - 1),
          })}
          pagination={false}
          scroll={{ x: "100%" }}
          className="custom-table hidden md:block"
          // style={{ height: "calc(100vh - 333px)" }}
        />
      </Box>
      {popup.remove && (
        <PopupCreateAdmin
          status={popup.status}
          handleClose={() =>
            popup.status === "create"
              ? navigate(`/admin/management-admin?${searchParams}`)
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
        open={popupRemove.remove}
        handleClose={() =>
          setPopupRemove((prev) => ({ ...prev, remove: false }))
        }
        refetch={refetch}
        name_item={[popupRemove.name]}
      />
    </>
  );
};

export default ListAdmin;
