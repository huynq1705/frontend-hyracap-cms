import { Store } from "@mui/icons-material";

export const showSuccess = ({ message }) => {
    return Store.addNotification({
        message,
        type: "success",
        title: "Thông báo",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 2000,
        },
        className: "custom-success",
    });
};

export const showError = (error) => {
    Store.addNotification({
        title: "Lỗi",
        message: error,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
        },
    });
};

export const showWarning = ({ message }) => {
    Store.addNotification({
        title: "Thông báo",
        message:
            message ||
            "Please wait a few minutes before you try again or contact support team",
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
        },
    });
};
