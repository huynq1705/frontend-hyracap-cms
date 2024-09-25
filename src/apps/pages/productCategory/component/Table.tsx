import useCustomTranslation from "@/hooks/useCustomTranslation";
import { Box, Stack } from "@mui/material";
import { Empty, Table, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import ModalEdit from "./ModalEdit";
import PopupConfirmImport from "@/components/popup/confirm-import";
import { KeySearchType } from "@/types/types";
import {
  convertObjToParam,
  handleGetPage,
  parseQueryParams,
} from "@/utils/filter";
import SearchBoxTable from "@/components/search-box-table";
import MySelect from "@/components/input-custom-v2/select";
import CStatus from "@/components/status";
import { setTotalItems } from "@/redux/slices/page.slice";
import { selectPage } from "@/redux/selectors/page.slice";
import TableResponsive from "./tableResponsive";
import EmptyIcon from "@/components/icons/empty";
interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
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
              <span className="font-medium text-gray-9 text-sm">
                STT
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{index + 1}</span>
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
            <span className="font-medium text-gray-9 text-sm">Tên sản phẩm</span>
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
                      onClick={() => {
                        navigate(`/admin/product-category/view/${item?.id}`);
                        actions.togglePopup("edit");
                      }}
                    />
                  )}
                  {hasPermission.update && (
                    <ActionButton
                      type="edit"
                      onClick={() => {
                        navigate(`/admin/product-category/edit/${item?.id}`);
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
  const { pathname } = useLocation();
  //permissions
  const { hasPermission } = usePermissionCheck("product_category");
  const { actions } = props;
  const columns: any = [
    {
      title: "STT",
      dataIndex: "product_category",

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
            {index + 1}
          </Typography>
        </Stack>
      ),
      width: 50,
    },
    {
      title: T("product-category"),
      dataIndex: "product_category",
      fixed: "left" as const,
      render: (_: any, item: any) => (
        <Typography className="text-sm font-semibold text-left">
          {item?.name ?? "- -"}
        </Typography>
      ),
      width: 380,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      width: 100,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            <CStatus
              type={d?.status ? "success" : "error"}
              name={d?.status ? "Active" : "Inactive"}
            />
          </Typography>
        </Stack>
      ),
    },
  ];
  {
    // (hasPermission.update || hasPermission.delete) &&
    columns.push({
      title: T("action"),
      width: 120,
      dataIndex: "actions",
      fixed: "right" as const,
      render: (_: any, d: any) => (
        <div className="flex justify-center">
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
              {/* {hasPermission.update && ( */}
              <ActionButton
                type="view"
                onClick={() => {
                  navigate(`/admin/product-category/view/${d?.id}`);
                  actions.togglePopup("edit");
                }}
              />
              {/* )} */}
              {/* {hasPermission.delete && ( */}
              <ActionButton
                type="edit"
                onClick={() => {
                  navigate(`/admin/product-category/edit/${d?.id}`);
                  actions.togglePopup("edit");
                }}
              />
              {/* )} */}
              {/* {hasPermission.delete && ( */}
              <ActionButton
                type="remove"
                onClick={() => {
                  actions.openRemoveConfirm("remove", d?.id);
                }}
              />
              {/* )} */}
            </Stack>
          )}
        </div>
      ),
    });
  }
  return columns;
};
interface ListProductCategoryProps {
  authorizedPermissions?: any;
}
const ListProductCategory = (props: ListProductCategoryProps) => {
  const { authorizedPermissions } = props;
  const { T } = useCustomTranslation();
  const { code } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  //--fn
  const { getProductCategory } = apiProductCategoryService();
  const dispatch = useDispatch();
  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["page"]) params["page"] = 1;
    if (!params["take"]) params["take"] = 10;
    return params;
  };

  const handleSearch = (
    objParam = {
      ...keySearch,
    },
  ) => {
    let filter = convertObjToParam(objParam, {
      page: currentPage,
      take: pageSize,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const togglePopup = (params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  };
  //--const
  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
  const { pathname, search } = useLocation();
  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  //--state
  const page = useSelector(selectPage);
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
  });
  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__in: "1;0",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["GET_PRODUCT_CATEGORY", param_payload, pathname],
    queryFn: () => getProductCategory({ ...param_payload, status__in: "1;0" }),
    keepPreviousData: true,
  });

  const dataConvert = useMemo(() => {
    if (data && data?.meta) {
      dispatch(setTotalItems(data?.meta?.itemCount ?? 1));
    }
    const list_data = !data?.status ? data?.data : data?.data?.data;
    if (Array.isArray(list_data))
      return list_data.map((item: any) => ({ ...item, key: item?.id }));
    return [];
  }, [data as any]);
  const selectedRowLabels = useMemo(() => {
    return dataConvert
      .filter((item: any) => selectedRowKeys.includes(item.key))
      .map((item: any) => item.name);
  }, [selectedRowKeys]);
  const text_search = useMemo(
    () => keySearch?.name__ilike?.toString() ?? "",
    [keySearch?.name__ilike, pathname],
  );
  //--effect
  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
    if (code || !pathname.includes("create")) return;
    if (pathname.includes("create") && !popup.edit) {
      navigate(`/admin/product-category/create`);
      togglePopup("edit");
    }
    if (pathname.includes("view") && !popup.edit) {
      navigate(`/admin/product-category/view/${code}`);
      togglePopup("edit");
    }

    if (pathname.includes("edit") && !popup.edit) {
      navigate(`/admin/product-category/edit/${code}`);
      togglePopup("edit");
    }
  }, [window.location.href]);
  return (
    <>
      <Box
        className="h-full"
      >
        <Box className="custom-table-wrapper ">
          <div className="gap-6  md:flex">
            <div className="w-full flex-wrap md:flex items-start justify-start gap-4">
              <SearchBoxTable
                keySearch={text_search}
                setKeySearch={(value?: string) => {
                  setKeySearch((prev) => ({
                    ...prev,
                    name__ilike: value || "",
                  }));
                }}
                handleSearch={handleSearch}
                placeholder="Tìm theo tên danh mục"
              />
            <div className="admin-from w-[217px] max-sm:w-full ">
              <MySelect
                options={[
                  { label: "Tất cả", value: "1;0" },
                  { label: "Inactive", value: "0" },
                  { label: "Active", value: "1" },
                ]}
                label={T("status")}
                errors={[]}
                required={[]}
                configUI={{
                  width: "calc(25% - 12px)",
                }}
                name="status__in"
                placeholder="Chọn"
                handleChange={(e) => {
                  const name = e?.target?.name;
                  const value = e?.target?.value;
                  const new_key_search: any = { ...keySearch };
                  if (value && name) new_key_search[name] = value;
                  handleSearch(new_key_search);
                }}
                values={{
                  status__in: [
                    !keySearch.status__in ? "1;0" : keySearch.status__in,
                  ],
                }}
                validate={{}}
                type="select-one"
                itemsPerPage={5}
              />
            </div>
            </div>
          </div>
          {search.includes("full_text") && key_search?.full_text && (
            <div>
              {dataConvert.length
                ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.full_text}'`
                : `Không tìm thấy nội dung nào phù hợp với '${key_search?.full_text}'`}
            </div>
          )}
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
            loading={isLoading}
            dataSource={dataConvert}
            columns={getColumns({
              actions,
            })}
            pagination={false}
            scroll={{ x: "100%" }}
            className="custom-table custom-table hidden md:block"
            />
  
            {/* mobile */}
            <CustomCardList dataConvert={dataConvert} actions={actions} />
            {dataConvert.length < 1 && (
              <Empty
                className="hidden max-sm:block w-full justify-center items-center"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          {/* Table custom
          <TableResponsive
            dataConvert={dataConvert}
            className="block md:hidden mb-[180px]"
            actions={actions}
            keySearch={keySearch}
            setKeySearch={setKeySearch}
            handleSearch={handleSearch}
          /> */}
        </Box>
      </Box>
      {popup.edit && (
        <ModalEdit
          open={popup.edit}
          toggle={() => {
            togglePopup("edit");
            navigate("/admin/product-category");
          }}
          refetch={refetch}
        />
      )}

      <PopupConfirmRemove
        listItem={selectedRowKeys}
        open={popup.remove}
        handleClose={() => togglePopup("remove")}
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

export default ListProductCategory;
