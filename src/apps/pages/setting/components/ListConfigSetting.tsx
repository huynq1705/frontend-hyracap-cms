import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, PaginationProps, Pagination, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import { formatDate } from "@/utils/date-time";
import CStatus from "@/components/status";
import { KeySearchType, OptionSelect } from "@/types/types";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
import EmptyIcon from "@/components/icons/empty";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
import apiSettingService from "@/api/Setting.service";
import clsx from "clsx";
import SettingCard from "./SettingCard";
import PopupConfigSetting from "./PopupConfigSetting";
import moment from "moment";
interface ColumnProps {
  hasPermissionConfirmed: boolean;
  hasPermissionView: boolean;
  refetch?: () => void;
  actions: {
    [key: string]: (...args: any) => void;
  };
  indexItem: number;
}

const getColumns = (props: ColumnProps) => {
  const navigate = useNavigate();
  const { T } = useCustomTranslation();
  const { hasPermission } = usePermissionCheck("product");
  const { actions, indexItem } = props;
  const columns = [
    {
      title: `Cấu hình mức đạt KPI`,
      width: 124,
      dataIndex: "verified",
      render: (_: any, d: any) => (
        <Stack
          direction={"column"}
          sx={{
            border: "1px solid",
            borderColor: () => {
              switch (d.status) {
                case 1:
                  return "var(--success-color)";
                case 0:
                  return "var(--gray-color)";
                case 2:
                  return "var(--warning-color)";
                default:
                  return "var(--bg-color-primary)";
              }
            },
            backgroundColor: () => {
              switch (d.status) {
                case 1:
                  return "var(--bg-color-primary)";
                case 0:
                  return "var(--bg-color-secondary)";
                case 2:
                  return "var(--warning-color)";
                default:
                  return "var(--bg-color-secondary)";
              }
            },
            padding: "8px !important",
          }}
          className={clsx("rounded-lg")}
        >
          <SettingCard data={d} />
          <Stack
            direction={"row"}
            sx={{
              gap: "16px",
              justifyContent: "flex-start",
              alignItems: "center",
              p: "9px",
            }}
          >
            {hasPermission.delete && d?.status === 2 && (
              <ActionButton
                type="remove"
                onClick={() =>
                  actions.openRemoveConfirm(true, d?.id, d?.full_name)
                }
              />
            )}
          </Stack>
        </Stack>
      ),
    },
    
  ];
  return columns;
};

interface ListRequestDepositProps {
  authorizedPermissions?: any;
}

const ListConfigSetting = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getSetting } = apiSettingService();
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
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ["GET_SETTING", param_payload, pathname],
    queryFn: () => getSetting(param_payload),
    keepPreviousData: true,
  });

  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    if (data && data.data && Array.isArray(data.data)) {
      console.log("moment", moment(new Date()));

      const filterredData = data.data.filter((record) => {
        return moment(record.effective_from).isBefore(moment());
      });
      const closestRecord =
        filterredData.length > 0
          ? filterredData.reduce((prev, curr) => {
              return moment(prev.effective_from).isAfter(
                moment(curr.effective_from)
              )
                ? curr
                : prev;
            })
          : null;

      return data.data.map((item) => ({
        ...item,
        key: item?.id,
        active:
          item?.id === closestRecord?.id
            ? 1
            : filterredData.includes(item)
            ? 0
            : 2,
      }));
    }

    return [];
  }, [data]);

  console.log("dataConvert", dataConvert);

  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_EMPLOYEE
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
      code_item: typeof INIT_EMPLOYEE
    ) => {
      togglePopup(key_popup, status, code_item);
    },
    openRemoveConfirm: (
      key_popup: boolean,
      code_item: string,
      name: string
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

    navigate("/admin/users");
    // refetch();
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
        {/* <Card> */}
        {/* <CustomCardList dataConvert={dataConvert} actions={actions} /> */}
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
          className="custom-table"
          // style={{ height: "calc(100vh - 333px)" }}
        />
      </Box>
      {popup.remove && (
        <PopupConfigSetting
          status={popup.status}
          handleClose={() =>
            popup.status === "create"
              ? navigate(`/admin/setting?${searchParams}`)
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

export default ListConfigSetting;
