import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Space, Pagination, PaginationProps } from "antd";
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
import SearchBoxTable from "@/components/search-box-table";
import CStatus from "@/components/status";
import PopupEdit from "./PopupEdit";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import { INIT_CUSTOMER_SOURCE } from "@/constants/init-state/customer_source";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
import EmptyIcon from "@/components/icons/empty";
interface ColumnProps {
  refetch?: () => void;
  actions: {
    [key: string]: (...args: any) => void;
  };
}
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
          <div className="flex flex-row items-center justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Mã - {item.id}
            </span>

            {/* <ButtonCore
              title="Cấp quyền"
              type="default"
              styles={{ height: 32 }}
              onClick={() => actions.openList(true, "edit", item?.id)}
            /> */}
          </div>

          <div className="flex flex-row items-start justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Nguồn khách hàng
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{item?.name}</span>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Trạng thái
              </span>
              <div className="flex flex-row flex-wrap gap-1.5 py-1">
                <CStatus
                  type={item?.status ? "success" : "error"}
                  name={item?.status ? "Active" : "Inactive"}
                />
              </div>
            </div>
          </div>

          {(hasPermission.update || hasPermission.delete) && (
            <div className="flex flex-col items-end border-b border-t-0 border-x-0  border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
              {/* <span className="font-medium text-gray-9 text-sm">Thao tác</span> */}
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
                        actions.openRemoveConfirm(true, item?.id, item.name)
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
  const { hasPermission } = usePermissionCheck("product");
  const { pathname } = useLocation();
  const { refetch, actions } = props;
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
          {index + 1}
        </Typography.Text>
      ),
      width: 46,
    },
    // {
    //     title: "Mã ",
    //     dataIndex: "id",
    //     width: 160,
    //     render: (_: any, d: any) => (
    //         <Typography.Text
    //             style={{
    //                 fontSize: "14px",
    //                 fontWeight: 400,
    //                 color: palette.textQuaternary
    //             }}
    //         >
    //             {d?.id}
    //         </Typography.Text>
    //     ),
    // },
    {
      title: T("customer-source"),
      dataIndex: "name",
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
            textAlign: "left",
          }}
        >
          {d.name}
        </Typography>
      ),
    },
    {
      title: T("status"),
      width: 124,
      dataIndex: "status",
      render: (_: any, d: any) => (
        <Stack>
          {/* <CSwitch checked={!!d?.status} /> */}
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
      zIndex: 76,
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
                onClick={() => actions.openRemoveConfirm(true, d?.id, d.name)}
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

const CTableCustomerSource = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getCustomerSource } = apiCustomerSourceService();
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_CUSTOMER_SOURCE,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);

  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__eq: "",
    ...key_search,
  });
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_CUSTOMER_SOURCE", param_payload, pathname],
    queryFn: () => getCustomerSource(param_payload),
    keepPreviousData: true,
  });

  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_CUSTOMER_SOURCE,
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
      code_item: typeof INIT_CUSTOMER_SOURCE,
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
  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    searchParams.set("page", pageNumber.toString());
    setSearchParams(searchParams);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    searchParams.set("take", pageSize.toString());
    setSearchParams(searchParams);
  };

  const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    name: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  };
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: 1,
      take: pageSize,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const handleOnChangeSearch = (name: string, value?: string) => {
    setKeySearch({ ...keySearch, [name]: value });
  };
  const handleOnChangeSearchStatus = (name: string, value?: string) => {
    setKeySearch({ ...keySearch, [name]: value });
    let filter = convertObjToParam(
      { ...keySearch, [name]: value },
      {
        page: 1,
        take: pageSize,
      },
    );
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  useEffect(() => {
    setPopup({
      remove: pathname.includes("create"),
      data: INIT_CUSTOMER_SOURCE,
      status: "create",
    });
  }, [pathname]);
  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    if (data && data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);
  return (
    <>
      <Box width="100%" className="custom-table-wrapper">
        <div className="flex flex-wrap gap-4">
          <SearchBoxTable
            keySearch={keySearch?.name__ilike}
            setKeySearch={(e) => {
              handleOnChangeSearch("name__ilike", e);
            }}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên nguồn khách hàng"
          />
          <MySelect
            options={[
              { label: "ALL", value: "" },
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ]}
            label={T("status")}
            errors={[]}
            required={[]}
            configUI={{
              width: "calc(25% - 12px)",
            }}
            name="status__eq"
            placeholder="Nguyễn Văn A"
            handleChange={(e) => {
              handleOnChangeSearchStatus(e.target.name, e.target.value);
            }}
            values={keySearch}
            validate={VALIDATE}
            type="select-one"
            itemsPerPage={5}
            className="max-sm:!w-full"
            // inputStyle={{height:36}}
          />
        </div>
        {/* <Card> */}
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
        <CustomCardList dataConvert={dataConvert} actions={actions} />
        <Table
          size="middle"
          bordered
          // rowSelection={rowSelection}'
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
            refetch,
            actions,
          })}
          pagination={false}
          scroll={{ x: "100%" }}
          className="custom-table  hidden md:block"
          // style={{ height: "calc(100vh - 333px)" }}
        />
        {/* </Card> */}
      </Box>
      {popup.remove && (
        <PopupEdit
          // listItem={selectedRowKeys}
          status={popup.status}
          handleClose={() =>
            popup.status === "create"
              ? navigate(`/admin/systems-customer?${searchParams}`)
              : setPopup((prev) => ({ ...prev, remove: false }))
          }
          refetch={() => {
            // setKeySearch({ status__eq: ""})
            if (pathname.includes("create")) {
              setKeySearch({ status__eq: "" });
              navigate(`${pathname.replace("/create", "")}`);
            } else {
              // navigate(`/admin/systems-customer?${searchParams}`)
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
        refetch={refetch}
        name_item={[popupRemove.name]}
      />
    </>
  );
};

export default CTableCustomerSource;
