import IconSvg from "@/components/IconSvg";
import NavigationList from "@/components/NavigationList";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { NavList } from "@/types/types";
import clsx from "clsx";
import { memo, useEffect, useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Location, Params, useLocation, useParams } from "react-router-dom";
import NavigationToolbar from "./NavigationToolbar";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { setActiveKey } from "@/redux/slices/navigation.slice";

import ProductIcon from "@/components/icons/product";
import CartIcon from "@/components/icons/cart";
import ScheduleIcon from "@/components/icons/schedule";
import CustomerIcon from "@/components/icons/customer";
import ReportIcon from "@/components/icons/report";
import PermissionsIcon from "@/components/icons/permissions";
import TagService from "@/components/icons/tag-service";
import SettingComponent from "@/components/icons/setting";
import ServiceComponent from "@/components/icons/service";
import EvaluationsIcon from "@/components/icons/evaluations";
import MediaIcon from "@/components/icons/media";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonCore from "@/components/button/core";
const getRoutePath = (location: Location, params: Params): string => {
    const { pathname } = location;

    if (!Object.keys(params).length) {
        return pathname; // we don't need to replace anything
    }

    let path = pathname;
    Object.entries(params).forEach(([paramName, paramValue]) => {
        if (paramValue) {
            // path = path.replace(paramValue, `:${paramName}`);
            path = path.replace(paramValue, ``);
        }
    });
    return path;
};
interface NavigationProps {
    handleDrawerToggle?: () => void;
    isOpen?: boolean;
    isHover?: boolean;
}

// add new page
const Navigation = (props: NavigationProps): JSX.Element => {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUserInfo);
    const { T, t } = useCustomTranslation();
    const location = useLocation();

    const params = useParams();
    useEffect(() => {
        const path = getRoutePath(location, params)
            .split("/")
            .filter(Boolean)
            .join("/");
        window.setTimeout(() => dispatch(setActiveKey(path), 100));
    }, [location, params]);

    const navTopDefine: NavList[] = useMemo(() => {
        const filteredNavItems: NavList[] = [
            {
                key: "group-top",
                items: [
                    {
                        label: T("api-report"),
                        icon: <IconSvg name="home" />,
                        key: "admin",
                        type: "link",
                        // role: "account.getList",
                    },
                    {
                        label: `${T("manage")} ${t("schedule")}`,
                        icon: <ScheduleIcon />,
                        key: "admin/schedule",
                        type: "link",
                        // role: ["admin"],
                    },
                    {
                        label: `${T("information")} ${t("customer")}`,
                        icon: <CustomerIcon />,
                        key: "admin/customer",
                        type: "link",
                    },
                    {
                        label: `${T("manage")} ${t("order")}`, //
                        icon: <CartIcon />, // icon - name : tên ảnh svg
                        key: "admin/order", // check width pathname => activate navbar
                        type: "link", // type navbar
                        // role: ["admin"],
                    },
                    {
                        label: `${T("manage")} ${t("tag")} ${t("service")}`,
                        icon: <TagService />,
                        key: "admin/tag-service-wrapper",
                        betaItem: true,
                        // role: ["admin"],
                        children: [
                            {
                                label: "DS KH dùng thẻ trả trước",
                                key: "admin/prepaid-card-face",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "DS KH dùng thẻ liệu trình",
                                key: "admin/order-detail-information/treatment",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "QL mệnh giá thẻ trả trước",
                                key: "admin/prepaid-card-face-value",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "QL loại thẻ liệu trình",
                                key: "admin/treatment",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `${T("manage")} ${t("products")}`, //
                        icon: <ProductIcon />, // icon - name : tên ảnh svg
                        key: "admin/manage-products", // check width pathname => activate navbar
                        betaItem: true, // type navbar
                        // role: ["admin"],
                        children: [
                            {
                                label: `QL ${t("list")} ${t("products")}`,
                                key: "admin/products",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: `QL ${t("category")} ${t("products")}`,
                                key: "admin/product-category",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `${T("manage")} ${t("service")}`,
                        icon: <ServiceComponent />,
                        key: "admin/service",
                        betaItem: true,
                        // role: ["account"],
                        children: [
                            {
                                label: T("service-tab"),
                                key: "admin/service-list",
                                type: "link",
                                // role: "account.category",
                            },
                            {
                                label: T("service-catalog"),
                                key: "admin/service-catalog",
                                type: "link",
                                // role: "account.getList",
                            },
                        ],
                    },
                    {
                        label: `${T("manage")} ${t("team")}`,
                        icon: <PermissionsIcon />,
                        key: "admin/manage-team",
                        betaItem: true,
                        role: ["account"],
                        children: [
                            {
                                label: T("admin_management"),
                                key: "admin/management-admin",
                                type: "link",
                                // role: ["admin"],
                                // role: ["account.getList"],
                            },
                            {
                                label: T("employee-manager"),
                                key: "admin/management-employee",
                                type: "link",
                                // role: ["account.put"],
                            },
                        ],
                    },

                    {
                        label: `Đánh giá`,
                        icon: <EvaluationsIcon />,
                        key: "admin/evaluation",
                        betaItem: true,
                        // role: ["admin"],
                        children: [
                            {
                                label: `${T("manage") + " " + t("evaluation")}`,
                                key: "admin/systems-evaluation",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "Đánh giá từ khách hàng",
                                key: "admin/evaluation-customer",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },

                    {
                        label: T("report"),
                        icon: <ReportIcon />,
                        key: "admin/reports-wrapper",
                        betaItem: true,
                        children: [
                            {
                                label: "BC doanh thu",
                                key: "admin/report-revenue",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "BC dịch vụ",
                                key: "admin/report-service",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "BC sản phẩm",
                                key: "admin/report-product",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "BC hoa hồng",
                                key: "admin/report-commission",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "BC đánh giá khách hàng",
                                key: "admin/report-customer",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `${T("setting")} ${t("system")}`,
                        icon: <SettingComponent />,
                        key: "admin/systems",
                        betaItem: true,
                        // role: ["admin"],
                        children: [
                            {
                                label: T("authorization"),
                                key: "admin/systems-position",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: T("payment-methods"),
                                key: "admin/systems-payment",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: T("customer-source"),
                                key: "admin/systems-customer",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: T("customer-classification"),
                                key: "admin/customer-classification",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: "Thông tin công ty",
                                key: "admin/company",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: T("setting"),
                                key: "admin/systems-setting",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `Quản lý truyền thông`,
                        icon: <MediaIcon />,
                        key: "admin/media",
                        type: "link",
                        // role: ["admin"],
                    },
                    {
                        label: `Ngân hàng đại lý`,
                        icon: <ScheduleIcon />,
                        key: "admin/bank",
                        type: "link",
                        // role: ["admin"],
                    },
                ],
            } as NavList,
        ];
        //phân quyền
        const filterNavTopDefine: NavList[] = filteredNavItems.map((group) => ({
            ...group,
            items: group.items
                .filter((itemTo) =>
                    Array.isArray(itemTo.role)
                        ? itemTo.role.some((role) =>
                              userInfo?.role?.some((permission: any) =>
                                  role.startsWith(permission.split(".")[0])
                              )
                          )
                        : true
                )
                .map((item) => ({
                    ...item,
                    children: item.children?.filter((child) =>
                        child.role
                            ? userInfo?.role?.includes(child.role[0])
                            : true
                    ),
                })),
        }));
        return filterNavTopDefine;
    }, [userInfo?.role, T]);

    return (
        <div
            className={clsx(
                "bg-transparent w-full h-screen overflow-hidden !transition-none flex flex-col relative pb-11"
            )}
        >
            <NavigationToolbar isOpen={props.isOpen} isHover={props.isHover} />
            <div
                className={clsx(
                    "h-full pt-8 pb-3 sm:pb-5 flex flex-col justify-between"
                )}
            >
                <div className="grow h-1">
                    <PerfectScrollbar options={{ suppressScrollX: true }}>
                        <NavigationList items={navTopDefine} position="top" />
                    </PerfectScrollbar>
                </div>
            </div>
            {window.innerWidth > 767 && (
                <ButtonCore
                    icon={
                        <FontAwesomeIcon
                            icon={props?.isOpen ? faArrowLeft : faArrowRight}
                        />
                    }
                    styles={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        boxShadow: "0px 8px 14px 0px rgba(173, 212, 180, 1)",
                    }}
                    onClick={() => {
                        props?.handleDrawerToggle && props.handleDrawerToggle();
                    }}
                />
            )}
        </div>
    );
};

export default memo(Navigation);
