import * as React from "react";
import styles from "@/apps/pages/blog/createPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import apiProjectService from "@/api/project.service";
import CkEditorCustom from "../components/CKEditor";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import apiManualService from "@/api/apiManual.service";
import { INIT_MANUAL, InitManualKeys } from "@/constants/init-state/manual";
import { PayloadManualItem } from "@/types/manual.type copy";
export interface ManualCreatePageProps {}

const VALIDATE = {
    name: "Tiêu đề là bắt buộc.",
    content: "Nội dung là bắt buộc.",
};
export default function ManualCreatePage(props: ManualCreatePageProps) {
    const userInfo = useSelector(selectUserInfo);
    const navigate = useNavigate();
    const { postManual } = apiManualService();
    const dispatch = useDispatch();
    const { getProject } = apiProjectService();
    const [manualData, setManualData] =
        React.useState<InitManualKeys>(INIT_MANUAL);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

    const handleChange = (field: string) => (value: any) => {
        console.log("value", value);
        setManualData((prev) => ({ ...prev, [field]: value }));
    };
    const handlePostManualDetail = async () => {
        setErrors({});
        const newErrors: { [key: string]: string } = {};
        if (!manualData.name) newErrors.name = VALIDATE.name;
        if (!manualData.content) newErrors.content = VALIDATE.name;
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            const convert_payload: PayloadManualItem = {
                name: manualData.name,
                content: manualData.content,
                description: "",
            };
            console.log("convert_payload", convert_payload);

            const response = await postManual(convert_payload, []);
            if (response.statusCode === 200) {
                dispatch(
                    setGlobalNoti({
                        type: "success",
                        message: "Tạo bài viết thành công",
                    })
                );
                navigate(`/admin/manual/view/${response.data.id}`);
                location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className={styles.container}>
            <Breadcrumb
                className={styles.breadCrumb}
                separator={<FontAwesomeIcon icon={faAngleRight} />}
                items={[
                    { title: "Bài viết", href: "/admin/manual" },
                    { title: "Tạo bài viết" },
                ]}
            />
            <div className={styles.content}>
                <header>
                    <h2>Tạo hướng dẫn</h2>
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.discard}
                            onClick={() => navigate("/admin/manual")}
                        >
                            Huỷ
                        </button>
                        <button
                            className={styles.complete}
                            onClick={handlePostManualDetail}
                        >
                            Hoàn tất
                        </button>
                    </div>
                </header>
                <div className={styles.editBlog}>
                    <div className={styles.first}>
                        <div className={styles.title}>
                            <p>
                                Tiêu đề<span>*</span>
                            </p>
                            <textarea
                                value={manualData.name}
                                onChange={(e) =>
                                    handleChange("name")(e.target.value)
                                }
                                placeholder="Nhập"
                                className={errors.name ? "error" : ""}
                            />
                            {errors.name && (
                                <p className={styles.errorMessage}>
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={styles.second}>
                        <p className={styles.secondTitle}>
                            Nội dung hướng dẫn<span>*</span>
                        </p>
                        <CkEditorCustom
                            contentData={manualData.content}
                            setContentData={handleChange("content")}
                            isEditable={true}
                            hasEror={
                                errors.content ===
                                "Nội dung bài viết là bắt buộc."
                            }
                        />
                        {errors.content && (
                            <p className={styles.errorMessage}>
                                {errors.content}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
