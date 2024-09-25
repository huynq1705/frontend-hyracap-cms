import React, { useState, useEffect, useMemo, useLayoutEffect } from "react";
import { Typography, Table, Space, PaginationProps, Pagination } from "antd";
import { Box } from "@mui/system";
import { Checkbox, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import palette from "@/theme/palette-common";
import { convertObjToParam, handleGetPage, handleGetParam } from "@/utils/filter";

import apiRoleService from "@/api/apiRole.service";
import apiPositionService from "@/api/apiPosition.service";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { setTotalItems } from "@/redux/slices/page.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import EmptyIcon from "@/components/icons/empty";
interface ColumnProps {
    refetch?: () => void;
    actions: {
        [key: string]: (...args: any) => void;
    };
}

interface ListRequestDepositProps {
    authorizedPermissions?: any;
}

const CTablePosition = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const { getPosition } = apiPositionService();
    const { getRole, putRole } = apiRoleService()
    const { T } = useCustomTranslation();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [listRole, setListRole] = useState<any[]>([]);
    const param_payload = useMemo(() => {
        return handleGetParam(searchParams);
    }, [searchParams]);

    const getDetail = async () => {

        try {

            const response = await getRole({ page: 1, take: 999 });
            if (response.data) {
                setListRole(response.data.map((item) => ({
                    name: item.name,
                    id: item.id,
                    role_permission: item.role_permission.map((itemRole: any) => itemRole.permission_id)
                })));
                console.log("kkkkkk", response.data);
            }
            console.log("kkkkkk", response);
        } catch (e) {
            throw e;
        }
    };
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_POSITION", param_payload, pathname],
        queryFn: () => getPosition(param_payload),
        keepPreviousData: true,
    });


    useEffect(() => {
        getDetail()
    }, [])
    useEffect(() => {
        dispatch(setTotalItems(data?.meta?.itemCount || 1))
    }, [data])

    console.log("kkk", listRole);

    const handleSubmitUpdate = async (listPermission: number[], code: string) => {
        // const payload = {};
        try {
            const response = await putRole({ permission_id: listPermission }, code, [])
            switch (response) {
                case true: {
                    // navigate("/customer");
                    // refetch && refetch()
                    // handleClose()
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: "createSuccess",
                        }),
                    );
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: "createError",
                        }),
                    );
                    break;
                }
                default: {
                    console.log(response);
                    if (typeof response === "object") {
                        // setErrors(response.missingKeys);
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
                    message: "createError",
                }),
            );
            console.error("==>", error);
        }
    };

    const columns = [
        {
            title: "",
            dataIndex: "stt",
            render: (_: any, item: any, index: number) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                        textAlign: "left"
                    }}
                >
                    {item?.description}
                </Typography>
            ),
            width: 300,
        },

        ...listRole.map((item, index) => (
            {
                title: item.name,
                dataIndex: item.name,
                width: 100,
                render: (_: any, d: any) => (
                    <Box>

                        <Checkbox
                            size="small"
                            checked={item.role_permission.includes(d.id)}

                            sx={{
                                padding: 0,
                                "&.Mui-disabled": {
                                    color: "#50945D", // Color when disabled
                                },
                            }}
                            // onClick={() => handleCheckBox(d?.id)}
                            onClick={() => {
                                if (item.role_permission.includes(d.id)) {
                                    let newList = [...listRole]
                                    newList[index].role_permission = newList[index].role_permission.filter((itemRole: number) => itemRole !== d.id)
                                    setListRole(newList)
                                    handleSubmitUpdate(newList[index].role_permission, item.id)

                                } else {
                                    let newList = [...listRole]
                                    newList[index].role_permission.push(d.id)
                                    setListRole(newList)
                                    handleSubmitUpdate(newList[index].role_permission, item.id)
                                }
                            }}
                        />
                    </Box>
                ),
            }
        ))

    ];

    return (
        <div className="h-full overflow-y-hidden">
            <div className="flex items-center gap-3 py-3 px-5 text-sm bg-white">
                <b onClick={() => history.back()}
                    className="text-[var(--text-color-primary)] cursor-pointer">Phân quyền</b>
                <FontAwesomeIcon icon={faAngleRight} />
                <span>Danh sách quyền </span>
            </div>
            <h3 className="my-6 pl-5 text-2xl">Danh sách quyền</h3>
            <div className="bg-white rounded-xl shadow-md sm:mx-5">
                <Box width="100%" className="custom-table-wrapper" >

                    {/* <Card> */}
                    <Table
                        size="middle"
                        bordered
                        // rowSelection={rowSelection}
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
                        loading={isLoading}
                        dataSource={data && Array.isArray(data?.data) ? data.data : []}
                        columns={columns}
                        pagination={false}
                        scroll={{ x: "100%" }}
                        className="custom-table"
                        // style={{ maxHeight: "calc(100vh - 100px)" }}
                    />

                </Box>
            </div>
        </div>

    );
};

export default CTablePosition;
