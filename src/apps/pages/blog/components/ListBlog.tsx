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
// import PopupCreateAdmin from "./PopupCreateAdmin";
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
import apiBlogCategoryService from "@/api/apiBlogCategory.service";
interface ColumnProps {
    hasPermissionConfirmed: boolean;
    hasPermissionView: boolean;
    refetch?: () => void;
    actions: {
        [key: string]: (...args: any) => void;
    };
    indexItem: number;
    text: any;
}
import { Tooltip } from "antd";
import apiBlogService from "@/api/apiBlog.service";
import CalendarContainer from "./CalenderContainer";
const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};
function removeAccents(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// HighlightText component
const HighlightText = ({
    text,
    highlight,
}: {
    text: string;
    highlight: any;
}) => {
    if (!highlight) return <span>{text}</span>;

    // Normalize text and highlight for comparison (without accents and lowercased)
    const normalizedText = removeAccents(text).toLowerCase();
    const normalizedHighlight = removeAccents(highlight).toLowerCase();

    // Split the text into parts, separating at the highlight term
    const parts = normalizedText.split(
        new RegExp(`(${normalizedHighlight})`, "gi")
    );

    return (
        <>
            {parts.map((part, index) => {
                const startIndex = normalizedText.indexOf(part); // Tính chỉ mục bắt đầu cho mỗi phần

                return part.toLowerCase() === normalizedHighlight ? (
                    // Highlight the matching part
                    <span key={index} style={{ color: "#50945D" }}>
                        {text.substring(startIndex, startIndex + part.length)}
                    </span>
                ) : (
                    // Return the non-highlighted part
                    <span key={index}>
                        {text.substring(startIndex, startIndex + part.length)}
                    </span>
                );
            })}
        </>
    );
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
                        <span className="font-medium text-gray-9 text-sm">
                            STT
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{index + 1}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tiêu đề
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <p
                                className="font-medium"
                                style={{
                                    color: "#50945d",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                }}
                            >
                                {item?.title}
                            </p>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Danh mục
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.blog_category?.name}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Trạng thái
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            {/* <span>{item?.customer_classification?.name ?? "- -"}</span>
                             */}
                            <CStatus
                                type={item?.is_public ? "success" : "error"}
                                name={item?.is_public ? "Public" : "Unpublic"}
                            />
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Ngày tạo
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {item?.created_at
                                    ? formatDate(item?.created_at, "DDMMYY")
                                    : "- -"}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Người tạo
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {item?.creator?.full_name
                                    ? item?.creator?.full_name
                                    : "- -"}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Ghi chú
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <p
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                }}
                            >
                                {item.note}
                            </p>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Trạng thái
                        </span>
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
                            <span className="font-medium text-gray-9 text-sm">
                                Thao tác
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <div className="flex items-center g-8 justify-start space-x-4">
                                    {hasPermission.getDetail && (
                                        <ActionButton
                                            type="view"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/blog/view/${item.id}`
                                                )
                                            }
                                        />
                                    )}

                                    {hasPermission.update && (
                                        <ActionButton
                                            type="edit"
                                            onClick={() => () =>
                                                navigate(
                                                    `/admin/blog/edit/${item.id}`
                                                )}
                                        />
                                    )}
                                    {hasPermission.delete && (
                                        <ActionButton
                                            type="remove"
                                            onClick={() =>
                                                actions.openRemoveConfirm(
                                                    true,
                                                    item?.id,
                                                    item?.name
                                                )
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
    const { hasPermission } = usePermissionCheck("blog");
    const { actions, indexItem, text } = props;

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
                        textAlign: "center",
                    }}
                >
                    {index + 1 + indexItem}
                </Typography>
            ),
            width: 46,
        },
        {
            title: T("title"),
            dataIndex: "title",
            // fixed: "left" as const,
            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"flex-start"}
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <Stack direction={"column"}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                // color: "var(--text-color-primary)",
                            }}
                        >
                            {/* {item?.title ?? "Không có tiêu đề"} */}
                            <Tooltip title={item?.title}>
                                <p
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "290px !important",
                                        width: "290px",
                                    }}
                                >
                                    <HighlightText
                                        text={item.title ?? "Không có tiêu đề"}
                                        highlight={text}
                                    />
                                </p>
                            </Tooltip>
                        </Typography>
                    </Stack>
                </Stack>
            ),
            width: 300,
        },
        {
            title: T("type"),
            dataIndex: "type",
            width: 172,
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
                        {item?.blog_category?.name ?? "Chưa có danh mục"}
                    </Typography>
                </Stack>
            ),
        },
        {
            title: T("status"),
            width: 140,
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
                        type={d?.is_public ? "success" : "error"}
                        name={d?.is_public ? "Public" : "Unpublic"}
                    />
                </Stack>
            ),
        },
        {
            title: T("date_created"),
            dataIndex: "date_created",
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
            title: T("creator"),
            dataIndex: "creator",
            width: 160,
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
                        {`${item?.creator?.first_name ?? ""} ${
                            item?.creator?.last_name ?? ""
                        }`.trim() || "Chưa có người tạo"}
                    </Typography>
                </Stack>
            ),
        },

        {
            title: T("note"),
            dataIndex: "note",
            width: 200,
            render: (_: any, item: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        <Tooltip title={item?.note}>
                            <p
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "190px !important",
                                    width: "190px",
                                    marginBottom: "0px !important",
                                }}
                                className="m-0"
                            >
                                {item.note}
                            </p>
                        </Tooltip>
                    </Typography>
                </Stack>
            ),
        },
        {
            title: "Thao tác",
            width: 114,
            dataIndex: "actions",
            fixed: "right" as const,
            shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
            zIndex: 100,
            render: (_: any, d: any) => (
                <>
                    {/* check permission */}
                    <Stack
                        direction={"row"}
                        className="!w-full !p-1 !h-fit flex"
                        sx={{
                            gap: "8px",
                            justifyContent: "space-between",
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
                                onClick={() =>
                                    navigate(`/admin/blog/view/${d.id}`)
                                }
                                className="!h-5"
                            />
                        )}
                        {hasPermission.update && (
                            <ActionButton
                                type="edit"
                                onClick={() =>
                                    navigate(`/admin/blog/edit/${d.id}`)
                                }
                                className="!h-5"
                            />
                        )}
                        {hasPermission.delete && (
                            <ActionButton
                                type="remove"
                                onClick={() =>
                                    actions.openRemoveConfirm(
                                        true,
                                        d?.id,
                                        d?.full_name
                                    )
                                }
                                className="h-5"
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

const ListBlog = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const { getBlog } = apiBlogService();
    const { getAllBlogCategory } = apiBlogCategoryService();
    const { T, t } = useCustomTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [listType, setListType] = React.useState<OptionSelect>([
        { label: "Tất cả", value: "" },
    ]);
    const [popup, setPopup] = useState({
        remove: false,
        data: INIT_EMPLOYEE,
        status: "view",
    });
    const [popupRemove, setPopupRemove] = useState({
        remove: false,
        code: "",
        name: "",
    });
    const [searchParams] = useSearchParams();
    const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
    const [keySearchText, setKeySearchText] = useState<any>(key_search.text);
    const [keySearch, setKeySearch] = useState<KeySearchType>({});

    const param_payload = useMemo(() => {
        return handleGetParam(searchParams, "");
    }, [searchParams]);
    const { isLoading, isError, refetch, data } = useQuery({
        queryKey: ["GET_BLOG", param_payload, pathname],
        queryFn: () => getBlog(param_payload),
        keepPreviousData: true,
    });
    const dataConvert = useMemo(() => {
        dispatch(setTotalItems(data?.meta?.itemCount || 1));
        if (data && data.data && Array.isArray(data.data)) {
            return data.data.map((item) => ({
                ...item,
                key: item?.id,
                password: "",
            }));
        }
        return [];
    }, [data]);

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
            title__ilike: keySearch?.text?.toString().trim(),
        });
        console.log("filter>>>>>>>>>>>", keySearch?.text?.toString().trim());
        let url = `${pathname}${filter}`;
        navigate(url);
    };
    console.log("first,", keySearch);

    useEffect(() => {
        setPopup({
            remove: pathname.includes("create"),
            data: INIT_EMPLOYEE,
            status: "create",
        });
    }, [pathname]);
    const fetchDataType = async () => {
        try {
            const response = await getAllBlogCategory();
            if (response.data.length == 0) return [];
            const newListType = response.data.map((item: any) => ({
                label: item.name,
                value: item.id,
            }));
            setListType((prevList) => [...prevList, ...newListType]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const text_search = useMemo(
        () => keySearch?.text?.toString() ?? "",
        [keySearch?.text, pathname]
    );
    useEffect(() => {
        fetchDataType();
    }, []);

    return (
        <>
            <Box width="100%" className="custom-table-wrapper w-full ">
                <div className="w-full flex-wrap md:flex items-start justify-start gap-4 ">
                    {/* <div className="max-sm:w-full w-1/3"> */}
                    <SearchBoxTable
                        keySearch={text_search}
                        setKeySearch={(value?: string) => {
                            setKeySearch((prev) => ({
                                ...prev,
                                text: value || "",
                            }));
                        }}
                        handleSearch={handleSearch}
                        placeholder="Tìm theo tiêu đề"
                    />
                    {/* </div> */}

                    {/* {flagSearch && keySearch?.name__like && (
            <div>{`Có ${page.totalItem} kết quả cho từ khóa '${keySearch?.name__like}'`}</div>
          )} */}
                    {/* <div className="admin-from w-full flex justify-start gap-4 flex-1 blogFilterPage">
            <CalendarContainer
              className="flex-1 flex flex-col gap-2"
              label={T("date_created") + " " + t("blog")}
            />
            <MySelect
              options={listType}
              label="Danh mục"
              errors={[]}
              required={[]}
              name="blog_category_id__eq"
              handleChange={(e) => {
                handleOnChangeSearchStatus(e.target.name, e.target.value);
              }}
              values={keySearch}
              validate={VALIDATE}
              type="select-one"
              className="flex-1"
              itemsPerPage={listType.length}
            />
            <MySelect
              options={[
                { label: "Tất cả", value: "" },
                { label: "Public", value: "1" },
                { label: "Unpublic", value: "0" },
              ]}
              label={"Trạng thái"}
              errors={[]}
              required={[]}
              name="is_public__eq"
              placeholder="- -"
              handleChange={(e) => {
                handleOnChangeSearchStatus(e.target.name, e.target.value);
              }}
              values={keySearch}
              validate={VALIDATE}
              type="select-one"
              itemsPerPage={5}
              className="flex-1"
              inputStyle={{ height: 36 }}
            />
          </div> */}
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
                                    <p className="text-center mt-3">
                                        Không có dữ liệu
                                    </p>
                                </div>
                            </div>
                        ),
                    }}
                    bordered
                    loading={isLoading}
                    dataSource={dataConvert}
                    columns={getColumns({
                        refetch,
                        hasPermissionConfirmed:
                            authorizedPermissions?.confirmed,
                        hasPermissionView: authorizedPermissions?.view,
                        actions,
                        indexItem: pageSize * (currentPage - 1),
                        text: key_search.title__ilike ?? "",
                    })}
                    pagination={false}
                    scroll={{ x: "100%" }}
                    className="custom-table hidden md:block"
                    // style={{ height: "calc(100vh - 333px)" }}
                />
            </Box>
            <PopupConfirmRemove
                listItem={[popupRemove.code]}
                open={popupRemove.remove}
                handleClose={() =>
                    setPopupRemove((prev) => ({ ...prev, remove: false }))
                }
                refetch={refetch}
                name_item={[""]}
            />
        </>
    );
};

export default ListBlog;
