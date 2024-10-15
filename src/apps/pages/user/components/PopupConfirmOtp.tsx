import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
} from "@mui/material";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";

const OTPPopup = ({
    open,
    handleClose,
}: {
    open: boolean;
    handleClose: () => void;
}) => {
    const dispatch = useDispatch();

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: any, index: number) => {
        const value = (e.target as HTMLInputElement).value;

        if (/^[0-9]$/.test(value) || value === "") {
            // Cho phép xóa
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Chuyển sang ô tiếp theo nếu nhập ký tự
            if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === "Backspace") {
            // Xóa ký tự trong ô hiện tại
            if (otp[index] === "" && index > 0) {
                // Quay lại ô trước nếu ô hiện tại trống
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            // const response = await postTransaction(formData);
            // let message = `Tạo ${title_page} thất bại`;
            // let type = "error";
            // if (typeof response === "object" && response?.missingKeys) {
            //     setErrors(response.missingKeys);
            //     return;
            // }
            // if (response === true) {
            //     message = `Tạo ${title_page} thành công`;
            //     type = "success";
            //     handleCancel();
            // }
            // dispatch(
            //     setGlobalNoti({
            //         type,
            //         message,
            //     })
            // );
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "createError",
                })
            );
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Nhập OTP</DialogTitle>
            <DialogContent>
                <Box display="flex" justifyContent="center" gap={1}>
                    {otp.map((value, index) => (
                        <TextField
                            key={index}
                            inputProps={{
                                maxLength: 1,
                                style: {
                                    textAlign: "center",
                                    fontSize: "20px",
                                },
                            }}
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            sx={{ width: 40 }}
                        />
                    ))}
                </Box>
                <Box mt={2} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default OTPPopup;
