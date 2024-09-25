import React, { useState } from "react";
import { Image, Upload, Button, Avatar } from "antd";
import type { UploadFile, UploadProps } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCameraAlt, faCameraRetro, faCameraRotate, faCampground, faUser, faUserEdit, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import CIcon from "../icons";
import { checkImage } from "@/utils/utils";
import IconPhoto from "../icons/photo";
import IconShape from "../icons/shape";
type FileType = File;
const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface ListImageProps {
    isRequired?: boolean;
    fileList: UploadFile[];
    setFileList: (state: UploadFile[]) => void;
    data: string,
    disabled?: boolean,
    clear : VoidFunction
}

const AvatarImage: React.FC<ListImageProps> = (props) => {
    const { isRequired = true, fileList, setFileList, data, disabled,clear } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);

    };

    const imageUrl = fileList.length > 0 && fileList[0].originFileObj
        ? URL.createObjectURL(fileList[0].originFileObj as Blob)
        : "";
    return (
        <div className="w-full flex items-center justify-center">
            <div className="bg-[#fff] rounded-full w-fit" style={{ position: 'relative' }}>
                {/* <Upload
                    listType="picture-circle"
                    fileList={[]}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => false} // Prevent auto upload
                >
                        <Avatar
                            src={imageUrl}
                            icon={<FontAwesomeIcon icon={faUser} color="#98A2B3" size="2xs"/>}
                            className="rounded-full w-full h-full bg-[#D0D5DD] "
                        />
                    <button style={{ border: 0, background: "none", cursor: "pointer", position: "absolute", bottom: 4, right: 4 ,backgroundColor:'transparent',height:32,width:32 }} type="button">
                        <img src={"/src/assets/icons/photo.svg"} alt="icon" height={32} width={32} />
                    </button>
                </Upload> */}
                <Avatar
                    src={imageUrl || (checkImage(data) ? (import.meta.env.VITE_APP_URL_IMG + data) : "")}
                    size={140}
                    onClick={() => { handlePreview(fileList[0]) }}
                    icon={<FontAwesomeIcon icon={faUser} color="#98A2B3" size="2xs" />}
                    className="rounded-full w-full h-full bg-[#D0D5DD] "
                />
                <button 
                onClick={()=>{
                        setFileList([])
                        clear()
                }}
                style={{ 
                    border: 0, 
                    display: !disabled && (imageUrl || checkImage(data)) ? "block" : 'none' ,
                    cursor: "pointer", 
                    position: "absolute", 
                    top: 8, right: 8, 
                    height: 26, width: 26, 
                    borderRadius: 26 }} 
                    type="button">
                    <IconShape />
                </button>
                <Upload
                    listType="text"
                    fileList={[]}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    disabled={disabled}
                    accept="image/*"
                >
                    <button style={{ border: 0, background: "none", cursor: disabled ? "" : "pointer", position: "absolute", bottom: 4, right: 4, backgroundColor: 'transparent', height: 32, width: 32 }} type="button">
                        <IconPhoto />
                    </button>
                </Upload>
            </div>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    style={{ zIndex: 2000 }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                        getContainer: () => document.body,
                    }}
                    src={previewImage}
                />
            )}
        </div>
    );
};

export default AvatarImage;
