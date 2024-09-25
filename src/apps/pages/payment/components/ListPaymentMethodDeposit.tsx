import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import { Typography, Table, Space, PaginationProps, Pagination } from "antd";
import { Box } from "@mui/system";
import { Checkbox, Stack } from "@mui/material";
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
import PopupEditPaymentMethod from "./PopupCreateEmployee";
import ActionButton from "@/components/button/action";
import palette from "@/theme/palette-common";
import MySelect from "@/components/input-custom-v2/select";
import SearchBoxTable from "@/components/search-box-table";
import apiAccountService from "@/api/Account.service";
import { INIT_PAYMENT_METHOD } from "@/constants/init-state/payment_menthod";
import apiPaymentMethodService from "@/api/apiPayment.service";
import CStatus from "@/components/status";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
import EmptyIcon from "@/components/icons/empty";
import { setGlobalNoti } from "@/redux/slices/app.slice";
interface ColumnProps {
  refetch?: () => void;
  actions: {
    [key: string]: (...args: any) => void;
  };
  indexItem: number;
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
                Phương thức thanh toán
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
                        actions.openEditConfirm(true, "view", item)
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
  // const userInfo = useSelector(selectUserInfo);
  const { T } = useCustomTranslation();
  const { hasPermission } = usePermissionCheck("product");
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
      title: T("label-payment"),
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
      title: "Mặc định",
      dataIndex: "name",
      width: 86,
      render: (_: any, d: any) => (
        <Stack alignItems={"center"}>
          <Checkbox
            size="small"
            checked={d.default_payment === 1}

            sx={{
              padding: 0,
              "&.Mui-disabled": {
                color: "#50945D", // Color when disabled
              },
            }}
            // onClick={() => handleCheckBox(d?.id)}
            onClick={() => {
              actions.setDefault(d.id, d.default_payment === 1 ? 0 : 1)
            }}
          />
        </Stack>
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
            {/* {hasPermission.getDetail && (
              <ActionButton
                type="view"
                onClick={() => actions.openEditConfirm(true, "view", d)}
              />
            )} */}
            {hasPermission.update && (
              <ActionButton
                type="edit"
                onClick={() => actions.openEditConfirm(true, "edit", d)}
              />
            )}
            {hasPermission.delete && (
              <ActionButton
                type="remove"
                onClick={() => actions.openRemoveConfirm(true, d?.id, d?.name)}
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
const keywords = ["create", "view", "edit"];
const ListPaymentMethodDeposit = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getPaymentMethod , setPaymentMethod } = apiPaymentMethodService();
  const { T,t } = useCustomTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_PAYMENT_METHOD,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });
  const [searchParams] = useSearchParams();
  const { pageSize, key_search, currentPage } = handleGetPage(searchParams);

  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__eq: "",
    ...key_search,
  });
  
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_PAYMENT_METHOD", param_payload, pathname],
    queryFn: () => getPaymentMethod(param_payload),
    keepPreviousData: false,
  });

  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_PAYMENT_METHOD,
  ) => {
    setPopup((prev) => ({
      ...prev,
      remove: params,
      data: data,
      status: status,
    }));
    navigate(`/admin/systems-payment/${status}?${searchParams}`);
  };
  const handleSubmitUpdate = async (id : number , default_payment : number) => {
    let message = T("update") + " " + t("payment") + " " + t("fail");
    let type = "error";
    try {
      const response = await setPaymentMethod({ id: id, default_payment: default_payment })

      if(response){
        message = T("update") + " " + t("payment") + " " + t("success");
        type = "success"
      }
   
    } catch (error) {

    } finally {
      refetch()
      dispatch(
        setGlobalNoti({
          type,
          message,
        }))
    }
  };
  const actions = {
    openEditConfirm: (
      key_popup: boolean,
      status: string,
      code_item: typeof INIT_PAYMENT_METHOD,
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
    setDefault: (id: number, default_payment: number) => handleSubmitUpdate(id,default_payment)
  };
  const togglePopupRemove = (params: boolean, code: string, name: string) => {
    setPopupRemove((prev) => ({
      ...prev,
      remove: params,
      code: code,
      name: name,
    }));
  };

  const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  };

  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: 1,
      take: pageSize,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const handleOnChangeSearch = (value?: string) => {
    if (value) {
      setKeySearch({ ...keySearch, name__ilike: value });
    } else {
      const { name__ilike, ...rest } = keySearch;
      const filteredRest: { [key: string]: string } = Object.keys(rest).reduce(
        (acc, key) => {
          acc[key] = String(rest[key]);
          return acc;
        },
        {} as { [key: string]: string },
      );
      setKeySearch(filteredRest);
    }
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

  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    if (data && data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);
  useEffect(()=>{
    refetch()
  },[])
  return (
    <>
      <Box width="100%" className="custom-table-wrapper">
        <div className="flex flex-wrap gap-4">
          <SearchBoxTable
            keySearch={keySearch?.name__ilike}
            setKeySearch={handleOnChangeSearch}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên phương thức thanh toán"
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
            name="status__eq"
            placeholder="Nguyễn Văn A"
            handleChange={(e) => {
              handleOnChangeSearchStatus(e.target.name, e.target.value);
            }}
            values={keySearch}
            validate={VALIDATE}
            type="select-one"
            itemsPerPage={5}
            widthBox={"fit-content"}
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
            actions,
            indexItem: pageSize * (currentPage - 1),
          })}
          pagination={false}
          scroll={{ x: "100%"}}
          className="custom-table hidden md:block"
          // style={{ height: "calc(100vh - 333px)" }}
        />
        {/* </Card> */}
      </Box>
      {keywords.some((keyword) => pathname.includes(keyword)) && (
        <PopupEditPaymentMethod
          handleClose={() => {
            navigate(
              `${
                pathname.replace(/\/create|\/edit|\/view/g, "?") + searchParams
              }`,
            );
          }}
          refetch={() => {
            // setKeySearch({ status__eq: "" });
            if (pathname.includes("create")) {
              setKeySearch({ status__eq: "" });
              navigate("/admin/systems-payment");
            } else {
              navigate("/admin/systems-payment?" + searchParams);
              // refetch()
            }
            // refetch()
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

export default ListPaymentMethodDeposit;
