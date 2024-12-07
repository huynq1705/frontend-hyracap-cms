import React, { useMemo, useState } from "react";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import UploadImgIcon from "@/components/icons/upload_img_icon";
import ImgCrop from "antd-img-crop";
const { Dragger } = Upload;
type UploadFileProps = {
    isEditable?: boolean;
    imageUrl: string[] | string;
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
    // Normalize `imageUrl` to always be an array
    const normalizedImageUrl = useMemo(
        () => (Array.isArray(imageUrl) ? imageUrl : imageUrl ? [imageUrl] : []),
        [imageUrl]
    );
    console.log("normalizedImageUrl", normalizedImageUrl);
    const propsUpload: UploadProps = useMemo(
        () => ({
            name: "files",
            multiple: false,
            maxCount: 1,
            disabled: !isEditable,
            action: `${BASE_URL}files/upload_blog`,
            listType: "text",

            defaultFileList: normalizedImageUrl.map((url, index) => ({
                uid: `${index}`,
                name: url,
                status: "done",
                url: url,
            })),
            onChange(info) {
                const { status } = info.file;
                if (status !== "uploading") {
                    console.log(info.file, info.fileList);
                }
                if (status === "done") {
                    const uploadedUrl = `${BASE_IMG_URL}${info.file.response.data[0].key}`;
                    console.log("info", info);
                    setImgUrl([uploadedUrl]);
                    message.success(
                        `${info.file.name} file uploaded successfully.`
                    );
                } else if (status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                }
                if (info.file.status === "removed") {
                    setImgUrl([]);
                }
            },
            showUploadList: {
                showPreviewIcon: false,
                showDownloadIcon: false,
                showRemoveIcon: true,
            },
            onRemove() {
                setIsFirstRemoved(true);
                setImgUrl([]);
            },
            onDrop(e) {
                console.log("Dropped files", e.dataTransfer.files);
            },
        }),
        [imageUrl.length, isEditable]
    );
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
