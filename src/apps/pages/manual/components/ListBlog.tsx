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
import palette from "@/theme/palette-common";
import { formatDate } from "@/utils/date-time";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
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
import apiManualService from "@/api/apiManual.service";
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
                                {item?.name}
                            </p>
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
                                                    `/admin/manual/view/${item.id}`
                                                )
                                            }
                                        />
                                    )}

                                    {hasPermission.update && (
                                        <ActionButton
                                            type="edit"
                                            onClick={() => () =>
                                                navigate(
                                                    `/admin/manual/edit/${item.id}`
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
    const { hasPermission } = usePermissionCheck("manual");
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
            title: T("name"),
            dataIndex: "name",
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
                            <Tooltip title={item?.name}>
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
                                        text={item.name ?? "Không có tiêu đề"}
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
                                    navigate(`/admin/manual/view/${d.id}`)
                                }
                                className="!h-5"
                            />
                        )}
                        {hasPermission.update && (
                            <ActionButton
                                type="edit"
                                onClick={() =>
                                    navigate(`/admin/manual/edit/${d.id}`)
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

const ListManual = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const { getManual } = apiManualService();
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
        queryKey: ["GET_MANUAL", param_payload, pathname],
        queryFn: () => getManual(param_payload),
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
            name__ilike: keySearch?.text?.toString().trim(),
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

    const text_search = useMemo(
        () => keySearch?.text?.toString() ?? "",
        [keySearch?.text, pathname]
    );

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

export default ListManual;
