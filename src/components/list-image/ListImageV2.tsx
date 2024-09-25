import React, { useState } from "react";
import { } from "@ant-design/icons";
import { Image, Upload, Button } from "antd";
import type { UploadFile, UploadProps } from "antd";
import axios from "axios";
import { PlusOneOutlined } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { checkImage } from "@/utils/utils";

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
    length?: number;
    width?: string;
    setFileList: (state: UploadFile[]) => void;
    data: any[],
    disabled?: boolean,
    name: string,
    onChange: (name: string, value: any) => void
}

const ListImageV2: React.FC<ListImageProps> = (props) => {
    const {
        isRequired = true,
        fileList,
        length = 1,
        width = "100%",
        setFileList,
        disabled,
        data,
        name,
        onChange
    } = props;
    const [previewImageView, setPreviewImageView] = useState('');
    const handlePreview = async (file: UploadFile) => {
     
        setPreviewImageView(file.url || (file.preview as string));
    };

    const handleChange: UploadProps["onChange"] = async ({ file: newFile, fileList: newFileList }) => {
        const nameFile = newFile.name

        if (length === 1) {
            onChange(name, [nameFile])
        } else {
            if(newFile.status === "removed"){
                onChange(name, data.filter(item => item !== nameFile))
            }
            else onChange(name, [...data, nameFile])
               
               
        }
        setFileList(newFileList);

    };
    // const handleRemove: UploadProps["onRemove"] = async (file: UploadFile) => {
    //     const nameFile = file.name
    //     console.log("aa22", data);
    //     let dataNew = data.split(',').filter(itemImage => itemImage != nameFile).join(',')
    //     console.log("aa", dataNew);
      
    //     onChange(name, dataNew)

    // };
    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOneOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <Box
            sx={{
                width,
            }}
        >
            <label className="label mb-2 inline-block">
                Hình ảnh
                {isRequired && <span style={{ color: "red" }}>(*)</span>}
            </label>
            <div className="flex gap-4">
                {/* {previewImage?.split(',')?.map((item) => (
                    <div className="image-container rounded-md" style={{ display: item ? "block" : "none" }}>
                        <Image
                            src={item ? (checkImage(item) ? (import.meta.env.VITE_APP_URL_IMG + item) : item) : ""}
                            style={{ width: 100, height: 100, borderRadius: 6 }}
                        // preview={false} 
                        />
                        <div className="absolute flex items-center justify-center rounded-md top-0 left-0 right-0  bottom-0 opacity-0 hover:opacity-100 bg-[rgba(0,0,0,0.6)]">
                            <div className="delete-icon" onClick={() => { setPreviewImageView(item) }}>
                                <FontAwesomeIcon icon={faEye} />
                            </div>
                            <div className="delete-icon " onClick={() => { 
                                let dataNew = previewImage.split(',').filter(itemImage => itemImage !== item).join(',')
                                setPreviewImage(dataNew) 
                                // onChange(name, data.split(',').filter(itemImage => itemImage !== item).join(','))
                            }}>
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </div>

                        </div>
                    </div>
                ))} */}

                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    // onRemove={handleRemove}
                    multiple ={ length > 1 }
                    maxCount={length}
                    disabled={disabled}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    accept="image/*"
                >
                    {fileList.length >= length ? null : uploadButton}
                </Upload>
            </div>
            {previewImageView && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: !!previewImageView,
                        onVisibleChange: (visible) => setPreviewImageView(""),
                        // afterOpenChange: (visible) => !visible && setPreviewImageView(""),
                    }}
                    src={previewImageView}
                />
            )}
        </Box>
    );
};

export default ListImageV2;
