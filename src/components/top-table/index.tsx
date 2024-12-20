import React, { ReactElement, ReactNode } from "react";
import { Button, Col, Typography, Table } from "antd";
import { Box, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "../button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { getKeyPage } from "@/utils";
import UploadIcon from "../icons/upload";
import DownIcon from "../icons/download";
const PAGE_ACTIVE_IMPORT: string[] = ["customer", "service-list", "product"];
const PAGE_ACTIVE_EXPORT: string[] = [
    "management-employee",
    "customer",
    "product",
    "order",
    "service-list",
];
const PAGE_OFF_CREATE: string[] = [
    "users",
    "sale_history",
    "group_sale_history",
    "withdrawRequest",
];
const PAGE_REPORT: string[] = ["sale_history", "group_sale_history"];
interface TopTableCustomProps {
    actions?: {
        createFn?: () => void;
        uploadFn?: () => void;
        getLink?: () => void;
        downloadFn?: () => void;
        scheduleFn?: () => void;
    };
    children?: ReactNode;
}
const PAGE_PREFIX_CATEGORY = [
    "service-catalog",
    "product-category",
    "evaluation-customer",
];
const PAGE_PREFIX_MANAGE = ["prepaid-card-face-value"];
const PAGE_PREFIX_ADD = ["products"];
const PAGE_PREFIX_REGISTER = ["customer"];
export default function TopTableCustom(props: TopTableCustomProps) {
    const { actions, children } = props;
    const navigate = useNavigate();
    const { T, t } = useCustomTranslation();
    const { pathname } = useLocation();
    const title_page_btn = getKeyPage(pathname, "key_title");
    const check_actions = pathname.split("/")[2];
    let prefix = "create";
    let prefix_label = "Danh sách";
    if (PAGE_PREFIX_REGISTER.includes(check_actions)) prefix = "register";
    if (PAGE_PREFIX_ADD.includes(check_actions)) prefix = "add";
    //   if (pathname.includes("systems-customer")) prefix = "create";
    if (PAGE_PREFIX_CATEGORY.includes(check_actions)) prefix_label = "";
    if (PAGE_PREFIX_MANAGE.includes(check_actions)) prefix_label = "Quản lí";
    return (
        <Box
            component={"div"}
            className="flex flex-col md:items-start gap-3 lg:flex-row lg:justify-between"
        >
            <Col>
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "24px",
                        lineHeight: "40px",
                        margin: "0",
                    }}
                >
                    {PAGE_REPORT.includes(check_actions)
                        ? "Báo cáo " + t(title_page_btn)
                        : `${
                              prefix_label
                                  ? `${prefix_label} ${t(title_page_btn)}`
                                  : T(title_page_btn)
                          }`}
                </Typography.Title>
            </Col>

            <Box
                component={"div"}
                className="flex items-end w-full flex-row gap-3 flex-wrap justify-start lg:w-fit lg:flex-row lg:items-center"
            >
                {actions?.downloadFn &&
                    PAGE_ACTIVE_EXPORT.includes(check_actions) && (
                        <ButtonCore
                            title={T("export-to-excel")}
                            icon={<DownIcon />}
                            type="bgWhite"
                            onClick={() => {
                                actions?.downloadFn
                                    ? actions.downloadFn()
                                    : alert("not exist download fn");
                            }}
                        />
                    )}

                {actions?.uploadFn &&
                    PAGE_ACTIVE_IMPORT.includes(check_actions) && (
                        <ButtonCore
                            title={T("import-to-excel")}
                            icon={<UploadIcon />}
                            type="bgWhite"
                            onClick={() => {
                                actions?.uploadFn
                                    ? actions.uploadFn()
                                    : alert("not exist upload fn");
                            }}
                        />
                    )}
                {children && children}
                {actions?.createFn &&
                    !PAGE_OFF_CREATE.includes(check_actions) && (
                        <ButtonCore
                            title={`${T(prefix)} ${t(title_page_btn)}`}
                            onClick={() => {
                                actions?.createFn
                                    ? actions.createFn()
                                    : alert("not exist create fn");
                            }}
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        />
                    )}
            </Box>
        </Box>
    );
}
