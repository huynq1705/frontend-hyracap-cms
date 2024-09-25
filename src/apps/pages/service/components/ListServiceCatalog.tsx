import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
import ContainerBody from "@/components/ContainerBody";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import SearchBoxTable from "@/components/search-box-table";
import MySelect from "@/components/input-custom-v2/select";
import PopupEditServerCatalog from "../edit/PopupEditCatalog";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import ActionButton from "@/components/button/action";
import usePermissionCheck from "@/hooks/usePermission";
import { INIT_CATALOG } from "@/constants/init-state/service";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import { useDispatch } from "react-redux";
import { setTotalItems } from "@/redux/slices/page.slice";
import EmptyIcon from "@/components/icons/empty";
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
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div>


          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên danh mục dịch vụ
            </span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {" "}
                {item?.name}
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
  const { refetch, actions, indexItem } = props;
  const { T } = useCustomTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { hasPermission } = usePermissionCheck("product");
  return [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {index + 1 + indexItem}
        </Typography.Text>
      ),
      width: 46,
    },
    // {
    //   title: "Mã doanh mục",
    //   dataIndex: "transfer_code",
    //   width: 200,
    //   render: (_: any, d: any) => (
    //     <Stack
    //       direction={"column"}
    //       onClick={() => navigate(`${pathname}/edit/${d?.sh_code}`)}
    //       sx={{ cursor: "pointer" }}
    //       spacing={1}
    //     >
    //       <Typography
    //         style={{ fontSize: "14px", fontWeight: 500, textAlign: 'left' }}
    //       >
    //         {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
    //         DM-000{d.id}
    //       </Typography>
    //     </Stack>
    //   ),
    // },
    {
      title: "Tên danh mục dịch vụ",
      dataIndex: "name",
      render: (_: any, d: any) => (
        <Typography style={{ textAlign: "left" }}>{d.name}</Typography>
      ),
    },
    // {
    //   title: "Dịch vụ",
    //   dataIndex: "confirm_time",
    //   width: 90,
    //   render: (_: any, d: any) => (
    //     <Typography.Text style={{ textAlign: "center", width: 52 }}>
    //       {"(5)"}
    //     </Typography.Text>
    //   ),
    // },
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
};

interface ListRequestDepositProps {
  authorizedPermissions?: any;
}

const ListServiceCatalog = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getServiceCatalog } = apiServiceSpaServicerService();
  const [searchParams] = useSearchParams();
  const { pageSize, key_search, currentPage } = handleGetPage(searchParams);
  const [keySearchText, setKeySearchText] = useState<any>(key_search.text);
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_SERVICE_CATALOG", param_payload, pathname],
    queryFn: () => getServiceCatalog(param_payload),
    keepPreviousData: true,
  });
  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_CATALOG,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });

  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_CATALOG,
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
      code_item: typeof INIT_CATALOG,
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

  const dataConvert = useMemo(() => {
    if (data && Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  useEffect(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
  }, [data]);
  useEffect(() => {
    setPopup({
      remove: pathname.includes("create"),
      data: INIT_CATALOG,
      status: "create",
    });
  }, [pathname]);
  return (
    <ContainerBody>
      <Box width="100%" className="custom-table-wrapper">
        {/* <Stack direction={"row"} alignItems={"center"} spacing={2}> */}
        <div className="flex">
          <SearchBoxTable
            keySearch={keySearchText}
            setKeySearch={setKeySearchText}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên danh mục dịch vụ"
          />
        </div>
        {/* </Stack> */}
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
          dataSource={data && Array.isArray(data?.data) ? data.data : []}
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
      </Box>
      {popup.remove && (
        <PopupEditServerCatalog
          // listItem={selectedRowKeys}
          status={popup.status}
          handleClose={() =>
            popup.status === "create"
              ? navigate(`${pathname.replace("/create", "?") + searchParams}`)
              : setPopup((prev) => ({ ...prev, remove: false }))
          }
          refetch={() => {
            // handleOnChangeSearch("");
           
    ;
            if (pathname.includes("create")) {
              setKeySearchText("");
              navigate(`${pathname.replace("/create", "")}`)
            } else {
              // navigate(`/admin/service-catalog?` + searchParams);
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
    </ContainerBody>
  );
};

export default ListServiceCatalog;
