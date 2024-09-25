import apiCustomerClassificationService from "@/api/apiCustomerClassification.service";
import ActionButton from "@/components/button/action";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import usePermissionCheck from "@/hooks/usePermission";
import { KeySearchType } from "@/types/types";
import {
  convertObjToParam,
  handleGetPage,
  handleGetParam,
} from "@/utils/filter";
import { Box, Stack } from "@mui/material";
import { Table, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ModalEdit from "./ModalEdit";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import PopupConfirmImport from "@/components/popup/confirm-import";
import { formatCurrency } from "@/utils";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch, useSelector } from "react-redux";
import SearchBoxTable from "@/components/search-box-table";
import { selectPage } from "@/redux/selectors/page.slice";
import MySelect from "@/components/input-custom-v2/select";
import CStatus from "@/components/status";
import EmptyIcon from "@/components/icons/empty";
interface ColumnProps {
  actions: {
    [key: string]: (...args: any) => void;
  };
  indexItem: number;
}

const CustomCardList = ({ dataConvert, actions }: any) => {
  const { hasPermission } = usePermissionCheck("service");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
                Phân hạng khách hàng
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{item?.rank}</span>
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
          <div className="flex flex-row items-start justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">Mức đạt</span>
              <div className="text-gray-9 text-base py-1">
                <span> {formatCurrency(item?.required_amount)}</span>
              </div>
            </div>
            <div className="min-w-[76px]">
              <span className="font-medium text-gray-9 text-sm">Màu sắc</span>
              <div className="flex flex-row flex-wrap gap-1.5 py-1">
                <div
                  className="w-7 h-7 rounded-md "
                  style={{
                    background: item?.color_code ?? "transparent",
                  }}
                />
              </div>
            </div>
          </div>

          {(hasPermission.update || hasPermission.delete) && (
            <div className="flex flex-col items-end border-b border-t-0 border-x-0  border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
              {/* <span className="font-medium text-gray-9 text-sm">Thao tác</span> */}
              <Stack
                direction={"row"}
                sx={{
                  gap: "20px",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  p: 0.5,
                }}
              >
                <ActionButton
                  type="edit"
                  onClick={() => {
                    navigate(
                      `/admin/customer-classification/edit/${item?.id}?${searchParams}`,
                    );
                  }}
                />

                <ActionButton
                  type="remove"
                  onClick={() => {
                    actions.openRemoveConfirm("remove", item?.id);
                  }}
                />
              </Stack>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const getColumns = (props: ColumnProps) => {
  const { actions, indexItem } = props;
  const navigate = useNavigate();
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  //permissions
  const { hasPermission } = usePermissionCheck("customer_classification");

  const columns: any = [
    {
      title: "STT",
      dataIndex: "customer_classification",

      render: (_: any, item: any, index: number) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "left",
            }}
          >
            {index + 1 + indexItem}
          </Typography>
        </Stack>
      ),
      width: 30,
    },
    {
      title: T("customer-classification"),
      dataIndex: "customer_classification",
      render: (_: any, item: any) => (
        <Typography className="text-sm font-semibold text-left">
          {item?.rank ?? "- -"}
        </Typography>
      ),
      width: 200,
    },
    {
      title: "Mức đạt",
      dataIndex: "customer-classification",

      render: (_: any, item: any, index: number) => (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "left",
            }}
          >
            {formatCurrency(item?.required_amount)}
          </Typography>
      ),
      width: 100,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      render: (_: any, item: any) => (
        <Stack>
          <div
            className="w-7 h-7 rounded-md "
            style={{
              background: item?.color_code ?? "transparent",
            }}
          />
        </Stack>
      ),
      width: 52,
    },

    {
      title: T("status"),
      width: 50,
      dataIndex: "is_active",
      render: (_: any, d: any) => (
        <Stack
          direction={"row"}
          spacing={"6px"}
          alignItems={"center"}
          borderRadius={4}
          // p={1}
          // bgcolor={palette.bgPrimary}
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
      width: 60,
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
              <ActionButton
                type="edit"
                onClick={() => {
                  navigate(
                    `/admin/customer-classification/edit/${d?.id}?${searchParams}`,
                  );
                }}
              />

              <ActionButton
                type="remove"
                onClick={() => {
                  actions.openRemoveConfirm("remove", d?.id);
                }}
              />
            </Stack>
          )}
        </>
      ),
    },
  ];
  // {
  //   columns.push();
  // }
  return columns;
};
interface CustomerClassificationTableProps {
  authorizedPermissions?: any;
}
const keywords = ["create", "view", "edit"];
const CustomerClassificationTable = (
  props: CustomerClassificationTableProps,
) => {
  const { T } = useCustomTranslation();
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const dispatch = useDispatch();
  //-- fn
  const { getCustomerClassification } = apiCustomerClassificationService();
  const togglePopup = (params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  };
  const handleOnChangeSearch = (value?: string) => {
    if (value !== undefined) {
      setKeySearch({ ...keySearch, rank__ilike: value });
    } else {
      const { rank__ilike, ...rest } = keySearch;
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
  const handleSearch = () => {
    let filter = convertObjToParam(
      {
        ...keySearch,
        rank__ilike: keySearch?.rank__ilike?.toString().trim(),
      },
      {
        page: 1,
        take: pageSize,
      },
    );
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  //-- const
  const actions = {
    openRemoveConfirm: (key_popup: string, code_item: string) => {
      togglePopup(key_popup as keyof typeof popup);
      setSelectedRowKeys([code_item]);
    },
    togglePopup,
  };
  const { currentPage, pageSize, key_search } = handleGetPage(searchParams);

  //-- state
  const page = useSelector(selectPage);
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
    upload: false,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__eq: "",
  });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_CUSTOMER_CLASSIFICATION", param_payload, pathname],
    queryFn: () => getCustomerClassification(param_payload),
    keepPreviousData: true,
  });
  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    const data_res = data?.data;
    if (data_res && Array.isArray(data_res))
      return data_res.map((item) => ({ ...item, key: item?.id }));
    return [];
  }, [data]);
  const selectedRowLabels = useMemo(() => {
    return dataConvert
      .filter((item) => selectedRowKeys.includes(item.key))
      .map((item) => item.rank);
  }, [selectedRowKeys]);
  //-- effect
  useEffect(() => {
    let st = keywords.some((keyword) => pathname.includes(keyword));
    setPopup({ ...popup, edit: st });
  }, [pathname]);
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

  return (
    <>
      <Box width="100%" className="custom-table-wrapper">
        <div className="flex flex-wrap gap-4">
          <SearchBoxTable
            keySearch={keySearch?.rank__ilike}
            setKeySearch={handleOnChangeSearch}
            handleSearch={handleSearch}
            placeholder="Tìm theo tên"
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
            validate={{}}
            type="select-one"
            itemsPerPage={5}
            className="max-sm:!w-full"
            // inputStyle={{height:36}}
          />
        </div>
        {search.includes("full_name__like") && key_search?.full_name__like && (
          <div>
            {dataConvert.length
              ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.full_name__like}'`
              : `Không tìm thấy nội dung nào phù hợp với '${key_search?.full_name__like}'`}
          </div>
        )}
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
            actions,
            indexItem: pageSize * (currentPage - 1),
          })}
          pagination={false}
          scroll={{ x: "100%" }}
          className="custom-table hidden  md:block"
          // style={{ height: "calc(100vh - 333px)" }}
        />
      </Box>
      {/*  */}
      {popup.edit && (
        <ModalEdit
          open={popup.edit}
          toggle={() => {
            navigate(
              `${
                pathname.replace(/\/(create|view\/\d+|edit\/\d+)$/, "?") +
                searchParams
              }`,
            );
          }}
          refetch={() => {
            if (pathname.includes("create")) {
              setKeySearch({});
              navigate(
                `${pathname.replace(/\/(create|view\/\d+|edit\/\d+)$/, "?")}`,
              );
            } else {
              navigate(
                `${
                  pathname.replace(/\/(create|view\/\d+|edit\/\d+)$/, "?") +
                  searchParams
                }`,
              );
            }
          }}
        />
      )}

      {/*  */}
      <PopupConfirmRemove
        listItem={selectedRowKeys}
        open={popup.remove}
        handleClose={() => {
          togglePopup("remove");
        }}
        refetch={refetch}
        name_item={selectedRowLabels}
      />
      {/*  */}
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

export default CustomerClassificationTable;
