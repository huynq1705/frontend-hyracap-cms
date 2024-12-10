import React, { useMemo, useState } from "react";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import UploadImgIcon from "@/components/icons/upload_img_icon";
const { Dragger } = Upload;

type UploadFileProps = {
    isEditable?: boolean;
    imageUrl: string[];
    setImgUrl: (value: string[]) => void;
    hasError?: string;
    isFirstRemoved?: boolean;
    setIsFirstRemoved: (removed: boolean) => void;
};

const UploadFile: React.FC<UploadFileProps> = ({
    isEditable,
    imageUrl,
    setImgUrl,
    hasError,
    isFirstRemoved,
    setIsFirstRemoved,
}) => {
    const BASE_URL = import.meta.env.VITE_APP_BASE_API_URL;
    const BASE_IMG_URL = import.meta.env.VITE_APP_URL_IMG;
    const [internalFileList, setInternalFileList] = useState<
        UploadProps["fileList"]
    >([]);

    const normalizedImageUrl = useMemo(() => imageUrl || [], [imageUrl]);

    useMemo(() => {
        const flattenedUrls = Array.isArray(normalizedImageUrl[0])
            ? normalizedImageUrl.flat() // Flatten the nested array
            : normalizedImageUrl;

        setInternalFileList(
            flattenedUrls.map((url, index) => ({
                uid: `${index}`,
                name: url,
                status: "done",
                url,
            }))
        );
    }, [normalizedImageUrl]);

    const propsUpload: UploadProps = useMemo(
        () => ({
            height: "200px",
            name: "files",
            multiple: true,
            action: `${BASE_URL}files/upload_blog`,
            listType: "text",
            fileList: internalFileList,
            disabled: !isEditable,
            onChange(info) {
                const { file, fileList } = info;
                setInternalFileList([...fileList]);

                const { status } = file;
                if (status === "done") {
                    const newUploadedUrls = fileList
                        .filter((f) => f.status === "done" && f.response)
                        .map((f) => `${BASE_IMG_URL}${f.response.data[0].key}`);

                    const uniqueUrls = Array.from(
                        new Set([...imageUrl, ...newUploadedUrls])
                    );
                    setImgUrl(uniqueUrls);
                    message.success(`${file.name} tải lên thành công.`);
                } else if (status === "error") {
                    message.error(`${file.name} tải lên thất bại.`);
                }
                if (status === "removed") {
                    const remainingUrls = fileList
                        .filter((f) => f.status !== "removed")
                        .map((f) =>
                            f.url
                                ? f.url
                                : `${BASE_IMG_URL}${f.response.data[0].key}`
                        );
                    setImgUrl(remainingUrls);
                }
            },

            showUploadList: {
                showPreviewIcon: false,
                showDownloadIcon: false,
                showRemoveIcon: true,
            },
            onRemove() {
                setIsFirstRemoved(true);
            },
        }),
        [internalFileList, isEditable]
    );
    console.log("internalFileList", internalFileList);
    console.log("imageUrl", imageUrl);

    return (
        <section className={`${hasError ? "hasErrorUpload" : ""}`}>
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon !m-0 !h-[72px] !mb-[10px]">
                    <UploadImgIcon />
                </p>
                <p className="ant-upload-text !text-sm !m-0 font-medium">
                    Kéo thả tệp đính kèm hoặc Click để chọn tệp
                </p>
            </Dragger>
        </section>
    );
};

export default UploadFile;
