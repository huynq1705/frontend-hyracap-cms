import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Table,
  Pagination,
  PaginationProps,
  Tooltip,
  Empty,
  Image,
  Badge,
} from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
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
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import ActionButton from "@/components/button/action";
import PopupEditService from "../edit/PopupEditService";
import { INIT_CATALOG, INIT_SERVICE } from "@/constants/init-state/service";
import CStatus from "@/components/status";
import StatusCard from "@/components/status-card";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import SearchBoxTable from "@/components/search-box-table";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { setTotalItems } from "@/redux/slices/page.slice";
import PopupEditServerCatalog from "../edit/PopupEditCatalog";
import { selectPage } from "@/redux/selectors/page.slice";
import { ResponseTotal } from "@/types/service.type";
import EmptyIcon from "@/components/icons/empty";
import StatusCardV2 from "@/components/status-card/index-v2";
import { KeySearchType } from "@/types/types";
interface ColumnProps {
  refetch: () => void;
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
          {/* <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div> */}

          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Mã dịch vụ
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{item?.id}</span>
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

          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Tên dịch vụ
              </span>
              <div className="text-gray-9 text-base py-1">
                <span className="font-medium" style={{ color: "#50945d" }}>
                  {" "}
                  {item?.name.length > 20
                    ? item?.name.slice(0, 30) + "..."
                    : item?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Thời lượng
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{item?.time} phút</span>
              </div>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Danh mục</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.service_catalog?.name}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Chi phí</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatCurrency(item?.price)}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Đặt online</span>
            <div className="text-gray-9 text-base py-1">
            <CSwitch
                  checked={!!item?.is_book_online}
                  onClick={() =>
                    actions.onChangeStatus({
                      id: item?.id,
                      is_book_online: item?.is_book_online ? 0 : 1,
                    })
                  }
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
  const per_update = "customer.update";
  const per_delete = "customer.delete";
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const { hasPermission } = usePermissionCheck("product");
  const { refetch, actions, indexItem } = props;
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          {index + 1 + indexItem}
        </Typography.Text>
      ),
      width: 46,
    },
    // {
    //   title: "Ảnh đính kèm",
    //   dataIndex: "images",
    //   render: (_: any, d: any) => (
    //     <Stack
    //       alignItems={"center"}
    //       justifyContent={"center"}
    //       p={1}
    //     >
    //       <Stack
    //         sx={{ position: 'relative', width: 64, height: 64, borderRadius: 12 }}
    //       >
    //         <Image
    //           src={d?.image}
    //           alt={d?.image}
    //           style={{ height: 64, width: 64, borderRadius: d?.image ? 12 : 0 }}
    //           preview={!!d?.image}
    //         />
    //       { d?.length > 1 &&
    //           <div className="absolute bottom-0 right-0 px-1.5 bg-white rounded-lg">
    //             <Typography.Text style={{fontSize:12}}>
    //               +{d.length - 1}
    //             </Typography.Text>
    //           </div>
    //       }
    //       </Stack>
    //     </Stack>
    //   ),
    //   width: 110,
    // },
    {
      title: "Mã dịch vụ",
      dataIndex: "gc_code",
      render: (_: any, item: any) => (
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"start-flex"}
          sx={{
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate(`${pathname}/edit/${item?.sh_code}`)}
        >
          <Typography style={{ fontSize: "14px", fontWeight: 500 }}>
            {item?.id}
          </Typography>
        </Stack>
      ),
      width: 90,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      width: 240,
      render: (_: any, d: any) => {
        const tooltip = d?.name;
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
      title: "Thời lượng",
      dataIndex: "time",
      render: (_: any, d: any) => (
        <Typography.Text>{d?.time} phút</Typography.Text>
      ),
      width: 100,
    },
    {
      title: T("label-catalog"),
      dataIndex: "payment_method",
      render: (_: any, d: any) => (
        <Typography.Text>{d?.service_catalog?.name || "- -"}</Typography.Text>
      ),
      width: 230,
    },
    {
      title: "Chi phí",
      dataIndex: "price",
      // render: (_: any, d: any) => <TransactionStatus d={d} />,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            {formatCurrency(d?.price)}
          </Typography>
        </Stack>
      ),
      width: 120,
    },
    {
      title: "Đặt online",
      width: 100,
      dataIndex: "charge",
      render: (_: any, d: any) => (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <CSwitch
            checked={!!d?.is_book_online}
            onClick={() =>
              actions.onChangeStatus({
                id: d?.id,
                is_book_online: d?.is_book_online ? 0 : 1,
              })
            }
          />
        </Stack>
      ),
    },
    {
      title: T("status"),
      width: 100,
      dataIndex: "is_active",
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

const ListRequestDeposit = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { T } = useCustomTranslation();
  const { getService, putServiceStatus, getServiceTotal } =
    apiServiceSpaServicerService();
  const [searchParams] = useSearchParams();
  const { pathname, search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const page = useSelector(selectPage);
  const { pageSize, key_search, currentPage } = handleGetPage(searchParams);
  const [keySearchText, setKeySearchText] = useState<any>(key_search.text);
  const [keySearch, setKeySearch] = useState<KeySearchType>({});
  const [total, setTotal] = useState([
    {
      label: "Đặt online",
      color: "#875BF7",
      value: 0,
      name: "is_book_online__eq",
      status: "1",
    },
    {
      label: "Đang hoạt động",
      color: "#50945D",
      value: 0,
      name: "status__eq",
      status: "1",
    },
    {
      label: "Ngừng hoạt động",
      color: "#101828",
      value: 0,
      name: "status__eq",
      status: "0",
    },
  ]);
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_SERVICE", param_payload, pathname],
    queryFn: () => getService(param_payload),
    keepPreviousData: true,
  });

  const han = () => {
    getServiceTotal()
      .then((res) => {
        setTotal([
          {
            label: "Đặt online",
            color: "#875BF7",
            value: res.data.total_online,
            name: "is_book_online__eq",
            status: "1",
          },
          {
            label: "Đang hoạt động",
            color: "#50945D",
            value: res.data.total_active,
            name: "status__eq",
            status: "1",
          },
          {
            label: "Ngừng hoạt động",
            color: "#101828",
            value: res.data.total_inactive,
            name: "status__eq",
            status: "0",
          },
        ]);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_SERVICE,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });
  const [popupCatalog, setPopupCatalog] = useState({
    remove: false,
    data: INIT_CATALOG,
    status: "create",
  });
  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_SERVICE,
  ) => {
    setPopup((prev) => ({
      ...prev,
      remove: params,
      data: data,
      status: status,
    }));
  };

  const handleSubmitUpdate = async (data: {
    id: number;
    is_book_online: number;
  }) => {
    try {
      const response = await putServiceStatus(data);
      switch (response) {
        case true: {
          refetch();
          // handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: "updateSuccess",
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: "updateError",
            }),
          );
          break;
        }
        default: {
          if (typeof response === "object") {
            dispatch(
              setGlobalNoti({
                type: "info",
                message: "Nhập đẩy đủ dữ liệu",
              }),
            );
          }
        }
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "updateError",
        }),
      );
      console.error("==>", error);
    }
  };

  const actions = {
    openEditConfirm: (
      key_popup: boolean,
      status: string,
      code_item: typeof INIT_SERVICE,
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
    onChangeStatus: (data: { id: number; is_book_online: number }) => {
      handleSubmitUpdate(data);
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
  const handleSearch = () => {
    let filter = convertObjToParam(
      {},
      {
        page: 1,
        take: pageSize,
        text: keySearchText?.toString().trim(),
      },
    );
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const handleOnChangeSearchStatus = (name: string, value?: string) => {
    if (keySearch[name] === value) {
      setKeySearch({});
    } else {
      setKeySearch({ [name]: value });
    }
    let filter = convertObjToParam(
      keySearch[name] === value ? {} : { [name]: value },
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
    setPopupCatalog({
      ...popupCatalog,
      remove: pathname.includes("add_category"),
    });
    setPopup({
      ...popup,
      remove: pathname.includes("create"),
      data: INIT_SERVICE,
      status: "create",
    });
  }, [pathname]);
  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    if (data && data.data && Array.isArray(data.data))
      return data.data.map((item) => ({
        ...item,
        link_img: item?.link_img || [],
        commission_percentage: (item?.commission_percentage || 0) * 100,
        service_catalog_id: item?.service_catalog?.id,
        link_video: item?.link_video || "",
      }));
    return [];
  }, [data]);

  useEffect(() => {
    han();
  }, [data]);

  return (
    <>
      <Box width="100%" className="custom-table-wrapper">
        <div className="flex-wrap flex items-end justify-between ">
          <SearchBoxTable
            keySearch={keySearchText}
            setKeySearch={setKeySearchText}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên dịch vụ, mã dịch vụ"
          />
          <div className="flex-wrap flex justify-start lg:justify-end items-end gap-2 pb-1">
            {total.map((item) => (
              <StatusCardV2
                statusData={item}
                hightLine="label"
                active={keySearch[item.name] === item.status}
                onClick={() => {
                  handleOnChangeSearchStatus(item.name, item.status);
                }}
                 customCss="max-sm:w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
              />
            ))}
          </div>
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
            refetch,
            actions,
            indexItem: pageSize * (currentPage - 1),
          })}
          pagination={false}
          scroll={{ x: "100%" }}
          className="custom-table hidden md:block"
          // style={{ height: "calc(100vh - 345px)" }}
        />
      </Box>
      {popup.remove && (
        <PopupEditService
          // listItem={selectedRowKeys}
          status={popup.status}
          handleClose={() =>
            popup.status === "create"
              ? navigate(`/admin/service-list?${searchParams}`)
              : setPopup((prev) => ({ ...prev, remove: false }))
          }
          refetch={() => {
            // setKeySearchText("");
            // navigate(`/admin/service-list?${searchParams}`)
            // else {
            // }
            if (pathname.includes("create")) {
              setKeySearchText("");
              navigate("/admin/service-list");
            } else {
              // navigate(`/admin/service-list?${searchParams}`)
              setPopup((prev) => ({ ...prev, remove: false }));
              refetch();
            }
          }}
          data={popup.data}
        />
      )}
      {popupCatalog.remove && (
        <PopupEditServerCatalog
          status={popupCatalog.status}
          handleClose={() => navigate(`/admin/service-list${search}`)}
          refetch={() => {
            // setKeySearchText("");
            navigate(`/admin/service-list${search}`);
            refetch();
          }}
          data={popupCatalog.data}
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

export default ListRequestDeposit;
