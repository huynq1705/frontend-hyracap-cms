import ContainerBody from "@/components/ContainerBody";
import { Box } from "@mui/material";
import { Typography } from "antd";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";

import { INIT_NOTIFICATION } from "@/constants/init-state/notification";
import MyTextField from "@/components/input-custom-v2/text-field";
import ButtonCore from "@/components/button/core";
import apiNotificationService from "@/api/notification.service";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
const VALIDATE = {
  name: "Hãy nhập tên sản phẩm",
  members: "Hãy chọn nhân viên",
};
const KEY_REQUIRED = ["title", "message"];

const NotificationPage = () => {
  const [formData, setFormData] = useState(INIT_NOTIFICATION);
  const [errors, setErrors] = useState<string[]>([]);
  const { sendNotification } = apiNotificationService();
  const dispatch = useDispatch();

  const handleOnchange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = async () => {
    console.log("formData", formData);
    try {
      const res = await sendNotification(formData, KEY_REQUIRED);
      console.log("res", res);
      dispatch(
        setGlobalNoti({
          message: "Gửi thông báo thành công",
          type: "success",
        })
      );
    } catch (error) {
      console.log("error", error);
      dispatch(
        setGlobalNoti({
          message: "Gửi thông báo thất bại",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);
  return (
    <Stack
      sx={{
        padding: "10px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          padding: "10px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          //   justifyContent: "center",
          //   alignItems: "",
        }}
      >
        <MyTextField
          label="Tiêu đề"
          errors={errors}
          required={KEY_REQUIRED}
          //   configUI={{
          //     width: "calc(50% - 12px)",
          //   }}
          name="title"
          placeholder="Nhập"
          handleChange={handleOnchange}
          values={formData}
          validate={VALIDATE}
          disabled={false}
        />
        <MyTextField
          label="Nội dung"
          errors={errors}
          required={KEY_REQUIRED}
          //   configUI={{
          //     width: "calc(50% - 12px)",
          //   }}
          name="message"
          placeholder="Nhập"
          handleChange={handleOnchange}
          values={formData}
          validate={VALIDATE}
          disabled={false}
        />
        <ButtonCore
          title="Gửi thông báo"
          onClick={handleSendNotification}
          styles={{ width: "fit-content" }}
        />
      </Box>
    </Stack>
  );
};
export default NotificationPage;
