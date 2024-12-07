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
import BLogIcon from "@/components/icons/blog_icon";
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
                        label: `${T("manage")} ${t("products")}`, //
                        icon: <ProductIcon />, // icon - name : tên ảnh svg
                        key: "admin/manage-product", // check width pathname => activate navbar
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
                        label: `Hợp đồng`,
                        icon: <ServiceComponent />, // icon - name : tên ảnh svg
                        key: "admin/contract",
                        type: "link",
                        // role: ["admin"],
                    },
                    {
                        label: `Giao dịch`,
                        icon: <EvaluationsIcon />, // icon - name : tên ảnh svg
                        key: "admin/transaction",
                        type: "link",
                        // role: ["admin"],
                    },
                    {
                        label: `Người dùng`,
                        icon: <CustomerIcon />, // icon - name : tên ảnh svg
                        key: "admin/users",
                        type: "link",
                        // role: ["admin"],
                    },
                    {
                        label: `${T("manage")} ${t("team")}`, //
                        icon: <PermissionsIcon />, // icon - name : tên ảnh svg
                        key: "admin/manage-employee", // check width pathname => activate navbar
                        betaItem: true, // type navbar
                        // role: ["admin"],
                        children: [
                            {
                                label: `Quản lý nhóm`,
                                key: "admin/group",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: `QL ${t("employee-manager")}`,
                                key: "admin/staff",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `Hoa hồng`, //
                        icon: <ReportIcon />, // icon - name : tên ảnh svg
                        key: "admin/reported", // check width pathname => activate navbar
                        betaItem: true, // type navbar
                        // role: ["admin"],
                        children: [
                            {
                                label: `BC Hoa hồng cá nhân`,
                                key: "admin/sale_history",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: `BC Hoa hồng nhóm`,
                                key: "admin/group_sale_history",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `Báo cáo`,
                        icon: <BLogIcon />, // icon - name : tên ảnh svg
                        key: "admin/report",
                        type: "link",
                        // role: ["admin"],
                    },
                    {
                        label: `Quản lý dự án`, //
                        icon: <ReportIcon />, // icon - name : tên ảnh svg
                        key: "admin/manage_project", // check width pathname => activate navbar
                        betaItem: true, // type navbar
                        // role: ["admin"],
                        children: [
                            {
                                label: `Danh sách dự án`,
                                key: "admin/project",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: `Danh mục dự án`,
                                key: "admin/industry",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `${T("manage")} Blog`, //
                        icon: <BLogIcon />, // icon - name : tên ảnh svg
                        key: "admin/blog_manage", // check width pathname => activate navbar
                        betaItem: true, // type navbar
                        // role: ["admin"],
                        children: [
                            {
                                label: `Danh sách Blog`,
                                key: "admin/blog",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: `Danh mục Blog`,
                                key: "admin/blog_category",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
                    },
                    {
                        label: `${T("setting")} ${t("system")}`, //
                        icon: <SettingComponent />, // icon - name : tên ảnh svg
                        key: "admin/systems", // check width pathname => activate navbar
                        betaItem: true, // type navbar
                        // role: ["admin"],
                        children: [
                            {
                                label: `Quản lý ${t("position")}`,
                                key: "admin/position",
                                type: "link",
                                // role: ["admin"],
                            },
                            {
                                label: `Cài đặt chung`,
                                key: "admin/setting",
                                type: "link",
                                // role: ["admin"],
                            },
                        ],
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
