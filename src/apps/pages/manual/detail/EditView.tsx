import * as React from "react";
import styles from "@/apps/pages/blog/createPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Switch } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import CkEditorCustom from "../components/CKEditor";
import apiManualService from "@/api/apiManual.service";
import { INIT_MANUAL, InitManualKeys } from "@/constants/init-state/manual";

export interface ManualDetailPageProps {}

const VALIDATE = {
    name: "Tiêu đề là bắt buộc.",
    content: "Nội dung là bắt buộc.",
};

export default function ManualDetailPage(props: ManualDetailPageProps) {
    const { code } = useParams();
    const { pathname } = useLocation();
    const parts = pathname.split("/");
    const id = parts[parts.length - 1];
    const isEditable = parts[parts.length - 2] === "edit";
    const navigate = useNavigate();
    const { getManualDetail, putManual } = apiManualService();
    const [manualData, setManualData] =
        React.useState<InitManualKeys>(INIT_MANUAL);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const dispatch = useDispatch();

    const handleChange = (field: string) => (value: any) => {
        setManualData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };
    const fetchManualDetail = async () => {
        try {
            const response = await getManualDetail(code);

            setManualData(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handlePutManualDetail = async () => {
        if (!code) return;
        setErrors({});
        const newErrors: { [key: string]: string } = {};
        if (!manualData.name) newErrors.name = VALIDATE.name;
        if (!manualData.content) newErrors.content = VALIDATE.content;
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            const convert_payload = {
                name: manualData.name,
                content: manualData.content,
                description: manualData.description,
            };
            const response = await putManual(convert_payload, code, []);
            if (response.statusCode === 200) {
                dispatch(
                    setGlobalNoti({
                        type: "success",
                        message: "Chỉnh sửa hướng dẫn thành công",
                    })
                );
                navigate(`/admin/manual/view/${code}`);
                location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        fetchManualDetail();
    }, []);
    return (
        <div className={styles.container}>
            <Breadcrumb
                className={styles.breadCrumb}
                separator={<FontAwesomeIcon icon={faAngleRight} />}
                items={[
                    { title: "Hướng dẫn", href: "/admin/manual" },
                    { title: `${isEditable ? "Sửa" : "Xem"} hướng dẫn` },
                ]}
            />
            <div className={styles.content}>
                <header>
                    <h2>{isEditable ? "Sửa" : "Xem"} hướng dẫnt</h2>
                    <div className={styles.buttonContainer}>
                        {isEditable ? (
                            <>
                                <button
                                    className={styles.discard}
                                    onClick={() => {
                                        navigate(`/admin/manual/view/${id}`);
                                        // window.location.reload();
                                    }}
                                >
                                    Huỷ
                                </button>
                                <button
                                    className={styles.complete}
                                    onClick={handlePutManualDetail}
                                >
                                    Hoàn tất
                                </button>
                            </>
                        ) : (
                            <button
                                className={styles.complete}
                                onClick={() => {
                                    navigate(`/admin/manual/edit/${id}`);
                                    // window.location.reload();
                                }}
                            >
                                Sửa hướng dẫn
                            </button>
                        )}
                    </div>
                </header>
                <div className={styles.editBlog}>
                    <div className={styles.first}>
                        <div className={styles.title}>
                            <p>
                                Tiêu đề<span>*</span>
                            </p>
                            <textarea
                                disabled={!isEditable}
                                value={manualData.name}
                                onChange={(e) =>
                                    handleChange("name")(e.target.value)
                                }
                                className={errors.name ? styles.error : ""}
                            ></textarea>
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
                            isEditable={isEditable}
                            hasEror={errors.content === "Nội dung là bắt buộc."}
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
