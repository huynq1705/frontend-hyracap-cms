import React, { useState } from "react";
import {} from "@ant-design/icons";
import { Image, Upload, Button } from "antd";
import type { UploadFile, UploadProps } from "antd";
import axios from "axios";
import { PlusOneOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";

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
  disabled?: boolean;
  setFileList: (state: UploadFile[]) => void;
}

const ListImage: React.FC<ListImageProps> = (props) => {
  const {
    isRequired = true,
    fileList,
    length = 1,
    width = "100%",
    disabled = false,
    setFileList,
  } = props;
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

  // const handleUpload = async () => {
  //   setUploading(true);
  //   try {
  //     for (const file of fileList) {
  //       const formData = new FormData();
  //       formData.append("file", file.originFileObj as FileType);

  //       // Upload to S3 using axios or any preferred method
  //       await axios.post("https://your-s3-upload-url", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //     }

  //     // Clear fileList after successful upload
  //     setFileList([]);
  //     setUploading(false);
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     setUploading(false);
  //   }
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
      <Upload
        multiple={length > 1}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} // Prevent auto upload
        disabled = {disabled}
      >
        {fileList.length >= length ? null : uploadButton}
        {/* {uploadButton} */}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Box>
  );
};

export default ListImage;
