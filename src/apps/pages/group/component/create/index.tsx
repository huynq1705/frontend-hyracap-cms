import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ActionsCreatePage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import MySelect from "@/components/input-custom-v2/select";
import { OptionSelect } from "@/types/types";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { Box, Stack } from "@mui/material";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { INIT_CREATE_PRODUCT } from "@/constants/init-state/group";
import apiGroupService from "@/api/Group.service";
import apiStaffService from "@/api/apiStaff.service";
import FormHelperTextCustom from "@/components/form-helper-text";
const VALIDATE = {
    name: "Hãy nhập tên sản phẩm",
    members: "Chọn ít nhất 1 nhân viên",
};
const KEY_REQUIRED = ["name", "members"];
interface CreatePageProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}
export default function CreatePage(props: CreatePageProps) {
    //--init
    const { onClose, refetch, open } = props;
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { postGroup, putGroup } = apiGroupService();
    const { getStaff } = apiStaffService();
    const leadRef = useRef<string | null>(null);
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
    const handleCreate = async () => {
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

        try {
            console.log("leadRef", leadRef);
            console.log("formData.members", formData.members);
            const convert_payload = {
                name: formData.name,
                members: formData.members.map(
                    (memberId: any, index: number) => {
                        return {
                            staff_id: parseInt(memberId),
                            role: memberId === leadRef?.current ? 0 : 1,
                        };
                    }
                ),
            };
            const response = await postGroup(convert_payload, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response === true) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
                handleCancel();
            }
            dispatch(
                setGlobalNoti({
                    type,
                    message,
                })
            );
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Tạo thất bại",
                })
            );
        }
    };
    const handleCancel = () => {
        setFormData(INIT_CREATE_PRODUCT);
        navigate("/admin/products");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/products/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleCreate());
            refetch();
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {};
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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
    const [formData, setFormData] = useState(INIT_CREATE_PRODUCT);
    const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(
        null
    );
    const [lead, setLead] = useState<string>();
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

    const handleCheckboxChange = (value: string) => {
        setSelectedCheckbox(value);
        setLead(value);
        leadRef.current = value; // Lưu giá trị vào ref
    };
    //--effect
    useEffect(() => {
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
                <h3>Tạo đội nhóm</h3>
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
                    {/* product_category_id */}
                    <MySelect
                        configUI={{
                            width:
                                window.innerWidth < 601
                                    ? "100%"
                                    : "calc(50% - 12px)",
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
                        disabled={code} // Adjust items per page as needed
                    />
                </div>
                <Stack direction={"column"}>
                    <label className="label mt-6">Chọn trưởng nhóm</label>
                    {filteredStaff.map((item) => (
                        <div
                            key={item.value}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                margin: "8px 0",
                            }}
                        >
                            <input
                                type="checkbox"
                                id={`checkbox-${item.value}`}
                                checked={selectedCheckbox === item.value}
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
                    ))}
                    {selectedCheckbox === null && (
                        <FormHelperTextCustom
                            text={"Vui lòng chọn trưởng nhóm"}
                        />
                    )}
                </Stack>
            </div>
            <ActionsCreatePage actions={actions} isView={isView} />
        </>
    );
}
