import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apigroupervice from "@/api/apiProduct.service";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { ResponseProductItem } from "@/types/product";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import MySelect from "@/components/input-custom-v2/select";
import CurrencyInput from "@/components/input-custom-v2/currency";
import { OptionSelect } from "@/types/types";
import MySwitch from "@/components/input-custom-v2/switch";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ListImage from "@/components/list-image";
import { Timeline, UploadFile } from "antd";
import { v4 as uuidv4 } from "uuid";
import CustomCurrencyInput from "@/components/input-custom-v2/currency";
import X2ChevronDown from "@/components/icons/x2-chevron-down";
import apiHistoryService from "@/api/apiHistory.service";
import { formatDate } from "@/utils/date-time";
import dayjs from "dayjs";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import { Box, Grid, Stack } from "@mui/material";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import MultipleSelect from "@/components/input-custom-v2/select/multi-select-mui";
import { INIT_UPDATE_PRODUCT } from "@/constants/init-state/group";
import apiGroupService from "@/api/Group.service";
import apiStaffService from "@/api/apiStaff.service";
import MemberCard from "../MemberCard";
import FormHelperTextCustom from "@/components/form-helper-text";
import Grid2 from "@mui/material/Unstable_Grid2";
const VALIDATE = {
    name: "Hãy nhập tên sản phẩm",
    members: "Hãy chọn nhân viên",
};
const KEY_REQUIRED = ["name", "members"];
interface EditPageProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}
export default function EditPage(props: EditPageProps) {
    //--init
    const { onClose, refetch, open } = props;
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { detailCommon } = apiCommonService();
    const leadRef = useRef<string | null>(null);

    const { T, t } = useCustomTranslation();
    const { postGroup, putGroup, postGroupMember, deleteGroupMember } =
        apiGroupService();
    const { getStaff } = apiStaffService();

    const [isShow, setIsShow] = useState(false);

    const getAllStaff = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getStaff(param);
            if (response) {
                setStaff(
                    response.data.map((it: any) => ({
                        value: it.id.toString(),
                        label: it.first_name + " " + it.last_name,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(code, "/group");
            console.log("response", response);

            if (response) {
                const convert_data = {
                    id: response.id,
                    name: response.name,
                    members: response.members.map((member: any) =>
                        member.staff_id.toString()
                    ),
                };
                const selectedCheckbox = response.members
                    .filter((member: any) => member.role === 0)
                    .map((member: any) => +member.staff_id);
                setFormData(convert_data);
                setOldGroupNumber(
                    response.members.map((member: any) =>
                        member.staff_id.toString()
                    )
                );
                setOldGroup(response.name);
                setSelectedCheckbox(selectedCheckbox[0].toString());
                leadRef.current = selectedCheckbox[0];
                setCurentLead(selectedCheckbox[0]);
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
    const handleView = async () => {};
    const handleCancel = () => {
        setFormData(INIT_UPDATE_PRODUCT);
        navigate("/admin/group");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/group/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleView());
            refetch();
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {
        if (!code) return;
        if (formData.name === "") {
            VALIDATE.name = "Vui lòng nhập tên nhóm";
            setErrors(["name"]);
            return;
        }
        if (formData.members.length === 0) {
            VALIDATE.members = "Chọn ít nhất 1 nhân viên";
            setErrors(["members"]);
            return;
        }
        const newMembers = formData.members || [];
        console.log("newMembers", newMembers);
        console.log("leadRef", leadRef);
        if (
            leadRef.current &&
            !newMembers.includes(leadRef.current.toString())
        ) {
            setIsShow(true);
            return;
        }
        const oldMembers = oldGroupMember || [];
        const newItems = newMembers.filter(
            (member) => !oldMembers.includes(member)
        );
        const removedItems = oldMembers.filter(
            (member) => !newMembers.includes(member)
        );

        // Update group name if changed
        if (formData.name !== oldGroup) {
            try {
                const response = await putGroup(formData, code, KEY_REQUIRED);
                handleResponse(response, "Cập nhật tên nhóm");
            } catch (error) {
                console.error("Xảy ra lỗi khi cập nhật tên nhóm:", error);
                return;
            }
        }

        // Add new group members
        if (newItems.length > 0) {
            const payloadUpdate = newItems.map((item) => ({
                group_id: formData.id,
                staff_id: +item,
                role: leadRef.current === item ? 0 : 1,
            }));

            try {
                const response = await postGroupMember(
                    payloadUpdate,
                    code,
                    KEY_REQUIRED
                );
                handleResponse(response, "Thêm thành viên mới");
            } catch (error) {
                console.error("Xảy ra lỗi khi thêm:", error);
                return;
            }
        }
        // Remove old members
        if (removedItems.length > 0) {
            const payloadUpdate = {
                group_id: formData.id,
                member_ids: removedItems.map(Number),
            };

            try {
                const response = await deleteGroupMember(payloadUpdate);
                handleResponse(response, "Xóa thành viên");
            } catch (error) {
                console.error("Xảy ra lỗi khi xóa:", error);
                return;
            }
        }

        if (leadRef.current && oldMembers.find((x) => x == leadRef.current)) {
            const payloadUpdate = {
                group_id: formData.id,
                staff_id: +leadRef?.current,
                role: 0,
            };

            try {
                const response = await postGroupMember(
                    payloadUpdate,
                    code,
                    KEY_REQUIRED
                );
                handleResponse(response, "Thêm thành viên mới");
            } catch (error) {
                console.error("Xảy ra lỗi khi thêm:", error);
                return;
            }
        }
    };
    const handleResponse = (response: any, action: any) => {
        if (typeof response === "object" && response?.missingKeys) {
            setErrors(response.missingKeys);
            return;
        }

        const message =
            response === true ? `${action} thành công` : `${action} thất bại`;
        const type = response === true ? "success" : "error";

        dispatch(setGlobalNoti({ type, message }));

        if (response === true) {
            handleCancel();
        }
    };
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };
    const handleCheckboxChange = (value: string) => {
        setSelectedCheckbox(value);
        leadRef.current = value;
    };
    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    const title_page = T(getKeyPage(pathname, "key"));
    //--state
    const [staff, setStaff] = useState<OptionSelect>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_UPDATE_PRODUCT);
    const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(
        null
    );
    const [currentLead, setCurentLead] = useState();
    const [oldGroup, setOldGroup] = useState();
    const [oldGroupMember, setOldGroupNumber] = useState<string[]>([]);

    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const actions = useMemo(
        () => ({ handelSave, handleRemove, handleCancel }),
        [formData]
    );
    const filteredStaff = staff.filter((item) =>
        formData.members.includes(item.value)
    );
    console.log("filteredStaff", filteredStaff);
    //--effect
    useEffect(() => {
        getDetail();
        if (open) {
            getAllStaff();
        }
        setIsShow(false);
    }, [code, open]);
    return (
        <>
            <Box
                className="flex px-4 py-3 justify-between items-center sticky top-0 left-0 w-[101%] !bg-white z-[4]"
                sx={{
                    border: "1px solid var(--border-color-primary)",
                }}
            >
                <h3>Chỉnh sửa đội nhóm</h3>
                <ButtonCore
                    type="secondary"
                    title=""
                    icon={
                        <FontAwesomeIcon
                            icon={faXmark}
                            width={"16px"}
                            height={16}
                            color="#000"
                        />
                    }
                    onClick={handleCancel}
                />
            </Box>
            <div className="wrapper-edit-page">
                <div className="wrapper-from items-end">
                    <MyTextField
                        label="Mã nhóm"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="id"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <MyTextField
                        label="Tên nhóm"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="name"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <MySelect
                        configUI={{
                            width: "100%",
                        }}
                        label="Thành viên"
                        name="members"
                        placeholder="Chọn thành viên nhóm"
                        handleChange={handleOnchange}
                        values={formData}
                        options={staff}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5}
                        type="select-multi"
                        disabled={isView}
                    />
                </div>
                <Stack direction={"column"}>
                    <label className="label mt-6">
                        Danh sách nhân viên (Chọn trưởng nhóm)
                    </label>
                    <Grid2 container spacing={2}>
                        {filteredStaff.map((item) => (
                            <Grid
                                item
                                xs={12} // 1 cột khi `sm`
                                sm={6} // 2 cột khi `md`
                                lg={4} // 3 cột khi `lg`
                                key={item.value}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        margin: "8px 0",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${item.value}`}
                                        checked={
                                            selectedCheckbox === item.value
                                        }
                                        value={item.value}
                                        onChange={() =>
                                            handleCheckboxChange(item.value)
                                        }
                                        className="custom-checkbox"
                                    />
                                    <label
                                        htmlFor={`checkbox-${item.value}`}
                                        style={{ marginLeft: "8px" }}
                                    >
                                        {item.label}
                                    </label>
                                    {selectedCheckbox === item.value && (
                                        <span
                                            style={{
                                                marginLeft: "8px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            (Trưởng nhóm)
                                        </span>
                                    )}
                                </div>
                            </Grid>
                        ))}
                    </Grid2>
                    {isShow && (
                        <FormHelperTextCustom
                            text={"Vui lòng chọn trưởng nhóm"}
                        />
                    )}
                </Stack>
            </div>
            <ActionsEditPage actions={actions} isView={isView} />
        </>
    );
}
