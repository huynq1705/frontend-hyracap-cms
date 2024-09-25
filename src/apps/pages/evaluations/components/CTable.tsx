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
import apiAccountService from "@/api/Account.service";
import { INIT_PAYMENT_METHOD } from "@/constants/init-state/payment_menthod";
import apiPaymentMethodService from "@/api/apiPayment.service";
import CStatus from "@/components/status";
import PopupEdit from "./PopupEdit";
import { formatDate } from "@/utils/date-time";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import apiEvaluationCriteriaService from "@/api/apiEvaluationCriteria.service";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
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
          {/* <div className="flex flex-row justify-between  border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">STT</span>
              <div className="text-gray-9 text-base py-1">{index + 1}</div>
            </div>

            <div>
              <span className="font-medium text-gray-9 text-sm">Ngày tạo</span>
              <div className="text-gray-9 text-base py-1">
                <span className="font-medium" style={{ color: "#50945d" }}>
                  {" "}
                  {formatDate(item?.created_at, "DDMMYYYY")}
                </span>
              </div>
            </div>
          </div> */}

          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                STT
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{index+1}</span>
              </div>
            </div>
            <div className="min-w-[80px]">
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
            <span className="font-medium text-gray-9 text-sm">Tiêu chí</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.name ?? "- -"}
              </span>
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
  // const userInfo = useSelector(selectUserInfo);
  const { T } = useCustomTranslation();
  const { hasPermission } = usePermissionCheck("product");
  const {
    hasPermissionConfirmed,
    hasPermissionView,
    refetch,
    actions,
    indexItem,
  } = props;
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
      width: 50,
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
      title: "Tiêu chí",
      dataIndex: "name",
      width: 280,
      fixed: "left" as const,
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
      width: 100,
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
      title: T("date_created"),
      dataIndex: "name",
      width: 120,
      render: (_: any, d: any) => (
        <Typography.Text
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
          }}
        >
          {formatDate(d?.created_at, "DDMMYYYY")}
        </Typography.Text>
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
                onClick={() => actions.openEditConfirm(true, "detail", d)}
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
                onClick={() => actions.openRemoveConfirm(true, d.id, d?.name)}
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

const CTableEvaluation = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getEvaluationCriteria } = apiEvaluationCriteriaService();
  const { T } = useCustomTranslation();
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

  const [keySearch, setKeySearch] = useState<KeySearchType>(key_search);
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_EVALUATION_CRITERIA", param_payload, pathname],
    queryFn: () => getEvaluationCriteria(param_payload),
    keepPreviousData: true,
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
  };
  const togglePopupRemove = (params: boolean, code: string, name: string) => {
    setPopupRemove((prev) => ({ ...prev, remove: params, code: code, name }));
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
  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    if (data && data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);

  useEffect(() => {
    setPopup({
      remove: pathname.includes("create"),
      data: INIT_PAYMENT_METHOD,
      status: "create",
    });
  }, [pathname]);
  return (
    <>
      <Box width="100%" className="custom-table-wrapper">
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <SearchBoxTable
            keySearch={keySearch?.name__ilike}
            setKeySearch={handleOnChangeSearch}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên tiêu chí"
          />
        </Stack>
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
          // rowSelection={rowSelection}
          loading={isLoading}
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
          dataSource={data && Array.isArray(data?.data) ? data.data : []}
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
        <PopupEdit
          // listItem={selectedRowKeys}
          status={popup.status}
          handleClose={() =>
            popup.status === "create"
              ? navigate(`/admin/systems-evaluation?${searchParams}`)
              : setPopup((prev) => ({ ...prev, remove: false }))
          }
          refetch={() => {
            if (pathname.includes("create")) {
              navigate(`${pathname.replace("/create", "")}`);
            } else {
              setPopup((prev) => ({ ...prev, remove: false }));
              refetch();
            }
            // handleOnChangeSearch("")
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

export default CTableEvaluation;
