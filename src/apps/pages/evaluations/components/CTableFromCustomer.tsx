import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Table,
  Space,
  PaginationProps,
  Pagination,
  Tooltip,
  Empty,
} from "antd";
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
import palette from "@/theme/palette-common";
import MySelect from "@/components/input-custom-v2/select";
import SearchBoxTable from "@/components/search-box-table";
import apiAccountService from "@/api/Account.service";
import {
  handleGetPage,
  handleGetParam
} from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
import EmptyIcon from "@/components/icons/empty";
import { ListStar } from "@/components/ListStar";
import ContainerBody from "@/components/ContainerBody";
import Tag from "./tag";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import apiOrderService from "@/api/apiOrder.service";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import apiProductService from "@/api/apiProduct.service";
import { INIT_EVALUATION } from "@/constants/init-state/evaluation";
interface ColumnProps {
  refetch?: () => void;
  actions: {
    [key: string]: (...args: any) => void;
  };
  indexItem: number;
}
const typeOrder = [
  {
    name: "Thẻ trả trước",
    color: "#875BF7",
  },
  {
    name: "Thẻ liệu trình",
    color: "#DE8208",
  },
  {
    name: "Dịch vụ",
    color: "#50945D",
  },

  {
    name: "Sản phẩm",
    color: "#0D63F3",
  },
];

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
          <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Mã đơn hàng
              </span>
              <div className="text-gray-9 text-base py-1">
                <span>{item?.id}</span>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-9 text-sm">
                Điểm trung bình
              </span>
              <div className="text-gray-9 text-base py-1">
                <ListStar
                  star={item?.average_score || 0}
                  size={16}
                  key={index}
                />
              </div>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên khách hàng
            </span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {" "}
                {item?.customer?.full_name || "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Số điện thoại
            </span>
            <div className="text-gray-9 text-base py-1">
              <span> {item?.customer?.phone_number || "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Loại</span>
            <div className="flex flex-row flex-wrap gap-1.5 py-1">
              {item?.order_detail?.map((item: any) => (
                <Tag
                  title={typeOrder[item?.type].name}
                  color={typeOrder[item?.type].color}
                />
              ))}
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Tên dịch vụ/sản phẩm
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {" "}
                {item?.order_detail?.map((item: any) => item.name).join(", ") ||
                  "- -"}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">
              Nhân viên thực hiện
            </span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.order_detail
                  ?.map((item: any) =>
                    item?.account_order?.map(
                      (order: any) => order?.account?.full_name,
                    ),
                  )
                  .flat()
                  .join(", ") || "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Ghi chú</span>
            <div className="text-gray-9 text-base py-1">
              <span> {item?.note || "- -"}</span>
            </div>
          </div>
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
    {
      title: "Mã đơn hàng",
      dataIndex: "id_order",
      render: (_: any, d: any) => (
        <Typography.Text
          style={{
            fontSize: "14px",
            fontWeight: 400,
            color: palette.textQuaternary
          }}
        >
          {d?.id}
        </Typography.Text>
      ),
      width: 120,
    },
    {
      title: T("name-customer"),
      dataIndex: "name_customer",
      fixed: "left" as const,
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
            textAlign: "left",
          }}
        >
          {d?.customer?.full_name || "- -"}
        </Typography>
      ),
      width: 172,
    },
    {
      title: T("phone_number"),
      dataIndex: "phone_number",
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
            textAlign: "left",
          }}
        >
          {d?.customer?.phone_number || "- -"}
        </Typography>
      ),
      width: 120,
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (_: any, d: any) => (
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: "6px",
            py: 1
          }}
        >
          {
            d?.order_detail?.map((item: any) => (
              <Tag
                title={typeOrder[item?.type].name}
                color={typeOrder[item?.type].color}
              />
            ))
          }

        </Stack>
      ),
      width: 200,
    },
    {
      title: "Tên dịch vụ/sản phẩm",
      dataIndex: "name_service",
      render: (_: any, d: any) => {
        const tooltip = d?.order_detail?.map((item: any) => item.name).join(', ') || "- -";
        const content =
          tooltip.length > 46 ? tooltip.slice(0, 40) + "..." : tooltip;
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
      width: 220,
    },
    {
      title: "Nhân viên thực hiện",
      dataIndex: "employee",
      render: (_: any, d: any) => {

        const tooltip = d?.order_detail
          ?.map((item: any) => item?.account_order?.map((order: any) => order?.account?.full_name))
          .flat()
          .join(', ') || "- -";
        const content =
          tooltip.length > 36 ? tooltip.slice(0, 30) + "..." : tooltip;
        return (
          <Typography
            style={{
              fontSize: "14px",
              color: palette.textQuaternary,
              textAlign: "left",
            }}
          >
            {/* {d?.creator?.full_name || "- -"} */}
            {/* {d?.order_detail?.map((item: any) => item?.account_order?.map((order: any) => order?.account?.full_name).join('; ')) || "- -"} */}
            <Tooltip placement="topLeft" title={tooltip}>
              {content}
            </Tooltip>
          </Typography>
        )
      },
      width: 180,
    },
    {
      title: "Điểm trung bình",
      dataIndex: "star",
      render: (_: any, d: any) => (
        <Stack>
          <ListStar star={d?.average_score || 0} size={16} />
        </Stack>
      ),
      width: 130,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: (_: any, d: any) => (
        <Typography
          style={{
            fontSize: "14px",
            color: palette.textQuaternary,
            textAlign: "left",
          }}
        >
          {d?.note || "- -"}
        </Typography>
      ),
      width: 124,
    },

    // {
    //     title: T("action"),
    //     width: 120,
    //     dataIndex: "actions",
    //     fixed: "right" as const,
    //     shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
    //     zIndex: 76,
    //     render: (_: any, d: any) => (
    //         <>
    //             {/* check permission */}
    //             <Stack
    //                 direction={"row"}
    //                 sx={{
    //                     gap: "16px",
    //                     justifyContent: "flex-start",
    //                     alignItems: "center",
    //                     px: "9px",
    //                     boxShadow: "",
    //                 }}
    //             >
    //                 {hasPermission.getDetail && (
    //                     <ActionButton
    //                         type="view"
    //                         onClick={() => actions.openEditConfirm(true, "view", d)}
    //                     />
    //                 )}
    //                 {hasPermission.update && (
    //                     <ActionButton
    //                         type="edit"
    //                         onClick={() => actions.openEditConfirm(true, "edit", d)}
    //                     />
    //                 )}
    //                 {hasPermission.delete && (
    //                     <ActionButton
    //                         type="remove"
    //                         onClick={() => actions.openRemoveConfirm(true, d?.id, d?.name)}
    //                     />
    //                 )}
    //             </Stack>
    //         </>
    //     ),
    // },
  ];
  return columns;
};

interface ListRequestDepositProps {
  authorizedPermissions?: any;
}
interface OptionProps {
  value: string;
  label: string;
}
const CTableEvaluationCustomer = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getOrder } = apiOrderService();
  const { getService } = apiServiceSpaServicerService()
  const { getProduct } = apiProductService()
  const { getAccount } = apiAccountService()
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  };
  const [serviceData, setServiceData] = useState<OptionProps[]>([{
    label: "Tất cả",
    value: ""
  }]);
  const [productData, setProductData] = useState<OptionProps[]>([{
    label: "Tất cả",
    value: ""
  }]);
  const [accountData, setAccountData] = useState<OptionProps[]>([{
    label: "Tất cả",
    value: ""
  }]);
  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_EVALUATION,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });
  const [searchParams] = useSearchParams();
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { pageSize, currentPage } = handleGetPage(searchParams);

  const [keySearch, setKeySearch] = useState<KeySearchType>(param_payload)

  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ["GET_ORDER", param_payload, pathname],
    queryFn: () => getOrder(param_payload),
    keepPreviousData: true,
  });

  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_EVALUATION,
  ) => {
    setPopup((prev) => ({
      ...prev,
      remove: params,
      data: data,
      status: status,
    }));
    // navigate(`/admin/evaluation-customer/${status}?${searchParams}`);
  };
  const actions = {
    openEditConfirm: (
      key_popup: boolean,
      status: string,
      code_item: typeof INIT_EVALUATION,
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

  const fetchData = async () => {
    try {
      const [service, product, account] = await Promise.all([
        getService({ take: 999, page: 1 }),
        getProduct({ take: 999, page: 1 }),
        getAccount({ take: 999, page: 1 }),
      ]);

      setServiceData([
        ...serviceData,
        ...service.data.map((item) => ({
          value: item.id.toString(),
          label: item.name,
        })),
      ]);
      setProductData([
        ...productData,
        ...product.data.map((item) => ({
          value: item.id.toString(),
          label: item.name,
        })),
      ]);
      setAccountData([
        ...accountData,
        ...account.data.map((item) => ({
          value: item.id.toString(),
          label: item.full_name,
        })),
      ]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
    }
  };

  const convertObjToParam = (page_obj: {
    page: number;
    take: number;
    text?: string;
    created_at?: string;
    type?: string;
    product_id?: string;
    account_id?: string;
    service_id?: string;
  }) => {
    let url = "?";
    url += `page=${page_obj.page}`;
    url += `&take=${page_obj.take}`;
    if (page_obj.text) {
      url += `&text=${page_obj.text}`;
    }
    if (page_obj.account_id) {
      url += `&account_id=${page_obj.account_id}`;
    }
    if (page_obj.created_at) {
      url += `&created_at=${page_obj.created_at}`;
    }
    if (page_obj.product_id) {
      url += `&product_id=${page_obj.product_id}`;
    }
    if (page_obj.type) {
      url += `&type=${page_obj.type}`;
    }
    if (page_obj.service_id) {
      url += `&service_id=${page_obj.service_id}`;
    }

    return url;
  };

  const handleSearch = () => {
    let filter = convertObjToParam({
      page: 1,
      take: pageSize,
      // text: keySearchText?.toString().trim(),
      ...keySearch,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const handleOnChangeSearchStatus = (name: string, value?: string) => {
    setKeySearch({ ...keySearch, [name]: value });
    let filter = convertObjToParam({
      page: 1,
      take: pageSize,
      // text: keySearchText?.toString().trim() ,
      ...keySearch,
      [name]: value,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };

  const dataConvert = useMemo(() => {
    dispatch(setTotalItems(data?.meta?.itemCount || 1));
    if (data && data.data && Array.isArray(data.data)) return data.data;
    // .map((item) => ({
    //     ...item,
    //     link_img: item?.link_img || [],
    //     commission_percentage: (item?.commission_percentage || 0) * 100,
    //     service_catalog_id: item?.service_catalog?.id,
    //     link_video: item?.link_video || ""
    // }));
    return [];
  }, [data]);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <ContainerBody>
      <Box width="100%" className="custom-table-wrapper">
        {/* <div className="flex-wrap flex gap-4 items-stretch"> */}
        <div className="wrapper-from flex items-start gap-4 self-stretch my-4">
          <SearchBoxTable
            keySearch={keySearch?.text}
            setKeySearch={(value) =>
              setKeySearch({ ...keySearch, text: value })
            }
            handleSearch={handleSearch}
            placeholder="Tìm theo mã đơn hàng"
          />
          <MyDatePicker
            label={"Ngày tạo đơn"}
            errors={[]}
            required={[]}
            name="created_at"
            placeholder="Chọn"
            widthBox={"fit-content"}
            handleChange={handleOnChangeSearchStatus}
            values={keySearch}
            validate={VALIDATE}
            type="select-one"
            itemsPerPage={5}
            className={"max-sm:!w-[calc(50%-8px)]"}
          />
          <MySelect
            options={[
              { label: "Tất cả", value: "" },
              { label: "Thẻ trả trước", value: "0" },
              { label: "Thẻ liệu trình", value: "1" },
              { label: "Dịch vụ", value: "2" },
              { label: "Sản phẩm", value: "3" },
            ]}
            label={"Loại"}
            errors={[]}
            required={[]}
            name="type"
            placeholder="Chọn"
            handleChange={(e) => {
              handleOnChangeSearchStatus(e.target.name, e.target.value);
            }}
            values={keySearch}
            validate={VALIDATE}
            type="select-one"
            itemsPerPage={5}
            widthBox={"fit-content"}
            className={"max-sm:!w-[calc(50%-8px)]"}
          // inputStyle={{height:36}}
          />
          <MySelect
            options={serviceData}
            label={T("service")}
            errors={[]}
            required={[]}
            name="service_id"
            widthBox={"fit-content"}
            handleChange={(e) => {
              handleOnChangeSearchStatus(e.target.name, e.target.value);
            }}
            values={keySearch}
            validate={VALIDATE}
            type="select-one"
            itemsPerPage={5}
            className={"max-sm:!w-[calc(50%-8px)]"}
          // inputStyle={{height:36}}
          />
          <MySelect
            options={productData}
            label={T("products")}
            errors={[]}
            required={[]}
            name="product_id"
            widthBox={"fit-content"}
            handleChange={(e) => {
              handleOnChangeSearchStatus(e.target.name, e.target.value);
            }}
            values={keySearch}
            validate={VALIDATE}
            type="select-one"
            itemsPerPage={5}
            className={"max-sm:!w-[calc(50%-8px)]"}
          // inputStyle={{height:36}}
          />
          <MySelect
            options={accountData}
            label={"Nhân viên thực hiện"}
            errors={[]}
            required={[]}
            name="account_id"
            widthBox={"fit-content"}
            handleChange={(e) => {
              handleOnChangeSearchStatus(e.target.name, e.target.value);
            }}
            values={keySearch}
            validate={VALIDATE}
            type="select-one"
            itemsPerPage={5}
            className={"max-sm:!w-[calc(50%-8px)]"}
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
        // style={{ height: "calc(100vh - 333px)" }}
        />
        {/* </Card> */}
        <CustomCardList dataConvert={dataConvert} actions={actions} />
      </Box>

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

export default CTableEvaluationCustomer;
