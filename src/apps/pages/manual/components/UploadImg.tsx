import React, { useMemo, useState } from "react";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import UploadImgIcon from "@/components/icons/upload_img_icon";
import ImgCrop from "antd-img-crop";
const { Dragger } = Upload;
type UploadImageProps = {
    isEditable?: boolean;
    imageUrl: string[] | string;
    setImgUrl: (value: string[]) => void;
    hasError?: string;
    isFirstRemoved?: boolean;
    setIsFirstRemoved: (removed: boolean) => void;
};

const UploadImage: React.FC<UploadImageProps> = ({
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

    const normalizedImageUrl = useMemo(
        () => (Array.isArray(imageUrl) ? imageUrl : imageUrl ? [imageUrl] : []),
        [imageUrl]
    );

    useMemo(() => {
        setInternalFileList(
            normalizedImageUrl.map((url, index) => ({
                uid: `${index}`,
                name: url.split("/").pop() || `File ${index + 1}`,
                status: "done",
                url,
            }))
        );
    }, [normalizedImageUrl]);

    const propsUpload: UploadProps = useMemo(
        () => ({
            height: "200px",
            name: "files",
            multiple: false,
            maxCount: 1,
            disabled: !isEditable,
            action: `${BASE_URL}files/upload_blog`,
            listType: "text",
            fileList: internalFileList,
            onChange(info) {
                const { file, fileList } = info;
                setInternalFileList([...fileList]);

                const { status } = file;
                if (status === "done") {
                    const uploadedUrl = `${BASE_IMG_URL}${file.response.data[0].key}`;
                    setImgUrl([uploadedUrl]);
                    message.success(`${file.name} tải lên thành công.`);
                } else if (status === "error") {
                    message.error(`${file.name} tải lên thất bại.`);
                }
                if (status === "removed") {
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
        }),
        [internalFileList, isEditable]
    );
    return (
        <section className={`${hasError ? "hasErrorUpload" : ""}`}>
            <ImgCrop
                // aspect={1}
                // beforeCrop={(file) => true}
                quality={1}
                rotationSlider
                showReset
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon !m-0 !h-[72px] !mb-[10px]">
                        <UploadImgIcon />
                    </p>
                    <p className="ant-upload-text !text-sm !m-0 font-medium">
                        Kéo thả tệp đính kèm hoặc Click để chọn tệp
                    </p>
                </Dragger>
            </ImgCrop>
        </section>
    );
};

export default UploadImage;
