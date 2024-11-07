import * as React from "react";
import styles from "@/apps/pages/blog/createPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Switch } from "antd";
import { INIT_PROJECT } from "@/constants/init-state/project";
import apiCommonService from "@/api/apiCommon.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiProjectService from "@/api/project.service";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";

const VALIDATE = {};

const KEY_REQUIRED = [""];

export default function ProjectCreatePage() {
    const { code } = useParams();
    const { pathname } = useLocation();
    const { postProject, putProject } = apiProjectService();
    const { T, t } = useCustomTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = React.useState<string[]>([]);
    const [formData, setFormData] = React.useState(INIT_PROJECT);
    const title_page = T(getKeyPage(pathname, "key"));

    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            const response = await postProject(formData, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response === true) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
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
                    message: "createError",
                })
            );
        }
    };
    const isView = React.useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    return (
        <div className={styles.container}>
            <Breadcrumb
                className={styles.breadCrumb}
                separator={<FontAwesomeIcon icon={faAngleRight} />}
                items={[
                    { title: "Bài viết", href: "/admin/blog" },
                    { title: "Tạo bài viết" },
                ]}
            />
            <div className={styles.content}>
                <header>
                    <h2>Tạo dự án</h2>
                    <div className={styles.buttonContainer}>
                        <button className={styles.discard}>Huỷ</button>
                        <button className={styles.complete}>Hoàn tất</button>
                    </div>
                </header>
                <div className={styles.editBlog}>
                    {/* name */}
                    <MyTextField
                        label="Tên dự án"
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
                    {/* description */}
                    <MyTextareaAutosize
                        label="Mô tả dự án"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="project_information_description"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                </div>
            </div>
        </div>
    );
}
