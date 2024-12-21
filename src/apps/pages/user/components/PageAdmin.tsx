import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsViewPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { INIT_USER } from "@/constants/init-state/user";
import { Box, Grid, Stack, Tab, useMediaQuery } from "@mui/material";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "antd";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { setSubTab } from "@/redux/slices/checkPanigation.slice";
import apiContractService from "@/api/apiContract.service";
import ContractCart from "./contractCard";
import EmptyIcon from "@/components/icons/empty";
const VALIDATE = {
    password: "Hãy Chưa update mật khẩu",
};
const KEY_REQUIRED = ["password"];
type History = {
    interest_rate: string;
    effective_from: string;
};
export default function ViewPage() {
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    //--state
    const [position, setPosition] = useState<OptionSelect>([]);
    const [contract, setContract] = useState<any>();
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_USER);
    const [subTabSchedule, setSubTabSchedule] = useState("1");
    const [popup, setPopup] = useState({
        edit: false,
        remove: false,
        loading: true,
    });
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { getContract } = apiContractService();

    const title_page = T(getKeyPage(pathname, "key"));

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(code, "/users");
            if (response) {
                const convert_data = {
                    id: response[0].id,
                    firstName: response[0].firstName,
                    lastName: response[0].lastName,
                    email: response[0].email,
                    phone: response[0].phone,
                    sub: response[0].sub,
                };
                setFormData(convert_data);
                setContract(response[0].contract);
                console.log("formData: ", response);
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Failed to fetch product details",
                })
            );
        }
    };
    // const getUserContract = async () => {
    //     try {
    //         const param = {
    //             page: 1,
    //             take: 999,
    //             user_sub__eq: code,
    //         };
    //         const response = await getContract(param);
    //         if (response && response.data.length > 0) {
    //             setContract(response.data);
    //             console.log("contract", response.data);
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    // };

    const handleCreate = async () => {
        // console.log("formData", formData);
        // try {
        //     const response = await postStaff(formData, KEY_REQUIRED);
        //     let message = `Tạo ${title_page} thất bại`;
        //     let type = "error";
        //     if (typeof response === "object" && response?.missingKeys) {
        //         setErrors(response.missingKeys);
        //         return;
        //     }
        //     if (response === true) {
        //         message = `Tạo ${title_page} thành công`;
        //         type = "success";
        //         handleCancel();
        //     }
        //     dispatch(
        //         setGlobalNoti({
        //             type,
        //             message,
        //         })
        //     );
        // } catch (error) {
        //     dispatch(
        //         setGlobalNoti({
        //             type: "error",
        //             message: "createError",
        //         })
        //     );
        // }
    };
    const handleCancel = () => {
        setFormData(INIT_USER);
        navigate("/admin/staff");
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/staff/edit/${code}`);
        } else {
            // dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {
        // console.log("formData", formData);
        // if (!code) return;
        // try {
        //     const response = await putStaff(formData, code, KEY_REQUIRED);
        //     let message = `Cập nhật ${title_page} thất bại`;
        //     let type = "error";
        //     if (typeof response === "object" && response?.missingKeys) {
        //         setErrors(response.missingKeys);
        //         return;
        //     }
        //     if (response === true) {
        //         message = `Cập nhật ${title_page} thành công`;
        //         type = "success";
        //     }
        //     dispatch(
        //         setGlobalNoti({
        //             type,
        //             message,
        //         })
        //     );
        //     if (response === true) {
        //         handleCancel();
        //     }
        // } catch (error) {
        //     dispatch(
        //         setGlobalNoti({
        //             type: "error",
        //             message: "updateError",
        //         })
        //     );
        //     console.error(error);
        // }
    };
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const isSmallScreen = useMediaQuery("(max-width: 640px)");

    const handleChangeSubTab = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        setSubTabSchedule(newValue);
    };
    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);

    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const actions = useMemo(
        () => ({ handelSave, handleRemove, handleCancel }),
        [formData]
    );
    //--effect
    useEffect(() => {
        code && getDetail();
        // getUserContract();
    }, [code, open]);
    useEffect(() => {
        if (isSmallScreen) {
            setSubTabSchedule("2");
        }
    }, [isSmallScreen]);
    useEffect(() => {
        if (subTabSchedule === "1" && pathname.includes("schedule")) {
            dispatch(setSubTab(true));
        } else {
            dispatch(setSubTab(false));
        }
    }, [subTabSchedule, pathname, dispatch]);
    useEffect(() => {
        return () => {
            dispatch(setSubTab(false));
        };
    }, []);
    return (
        <Stack className="h-auto">
            <Stack direction={"row"} gap={5} className="p-4 bg-white border-b">
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate("/admin/users");
                    }}
                >
                    Danh sách khách hàng
                </Typography.Title>
                <img src="/src/assets/icons/chevron-right-icon.svg" alt="" />
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "#50945D",

                        margin: "0",
                    }}
                >
                    Thông tin chi tiết
                </Typography.Title>
            </Stack>
            <Stack className="m-4 bg-white rounded-3xl">
                <TabContext value={subTabSchedule}>
                    {!isSmallScreen && (
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                backgroundColor: "#fff",
                            }}
                        >
                            <TabList
                                onChange={handleChangeSubTab}
                                aria-label="lab API tabs example"
                            >
                                <Tab label="Thông tin khách hàng" value="1" />
                                <Tab label="Danh sách hợp đồng" value="2" />
                            </TabList>
                        </Box>
                    )}
                    <TabPanel
                        sx={{
                            padding: 0,
                            display:
                                isSmallScreen && subTabSchedule === "1"
                                    ? "none"
                                    : "block",
                        }}
                        value="1"
                    >
                        {" "}
                        <div className="wrapper-edit-page bg-white">
                            <div className="wrapper-from items-end ">
                                {/* name */}
                                <MyTextField
                                    label="Mã khách hàng"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="sub"
                                    placeholder="Chưa update"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={true}
                                />
                                {/* name */}
                                <MyTextField
                                    label="Họ"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="firstName"
                                    placeholder="Chưa update"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={true}
                                />
                                {/* name */}
                                <MyTextField
                                    label="Tên"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="lastName"
                                    placeholder="Chưa update"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={true}
                                />
                                {/* email */}
                                <MyTextField
                                    label="Email"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="email"
                                    placeholder="Chưa update"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={true}
                                />
                                {/* sđt */}
                                <MyTextField
                                    label="Số điện thoại"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="phone"
                                    placeholder="Chưa update"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel sx={{ padding: 0 }} value="2">
                        <Stack
                            direction={"column"}
                            width={"100%"}
                            className="p-4"
                        >
                            <Grid container spacing={2} alignItems="stretch">
                                {contract ? (
                                    contract.map((c: any, index: number) => (
                                        <Grid
                                            item
                                            xs={4}
                                            key={index}
                                            style={{
                                                display: "flex",
                                            }}
                                        >
                                            <ContractCart data={c} />
                                        </Grid>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center py-10 w-full">
                                        <EmptyIcon />
                                    </div>
                                )}
                            </Grid>
                        </Stack>
                    </TabPanel>
                </TabContext>
            </Stack>
        </Stack>
    );
}
