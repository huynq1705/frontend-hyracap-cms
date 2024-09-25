import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import {
    Box,
    Dialog,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import EditProductCategoryPage from "./create";
import { INIT_PRODUCT_CATEGORY } from "@/constants/init-state/product_category";
import ButtonCore from "@/components/button/core";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faXmark } from "@fortawesome/free-solid-svg-icons";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
type Event = {
    employee: string;
    startTime: string;
    endTime: string;
    description: string;
};
export interface ModalEditProps {
    open: boolean;
    toggle: (key: any) => void;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalGetLink(props: ModalEditProps) {
    const { open, toggle } = props;
    const { T, t } = useCustomTranslation();
    const dispatch = useDispatch();
    const values = "https://cms.mitujsc.com/";
    const handleCopy = () => {
        navigator.clipboard.writeText(values);
        dispatch(
            setGlobalNoti({
                type: "success",
                message: "Sao chép link đặt hẹn",
            })
        );
    };
    return (
        <Dialog
            open={open}
            TransitionComponent={transition}
            keepMounted
            fullWidth
            maxWidth={"sm"}
            onClose={() => {
                toggle("listSchedule");
            }}
            aria-describedby="alert-dialog-slide-description"
        >
            <Box height={"fit-content"}>
                {" "}
                <>
                    <Box
                        className="flex px-4 py-3 justify-between items-center"
                        sx={{
                            border: "1px solid var(--border-color-primary)",
                        }}
                    >
                        <h3>Mã đặt hẹn</h3>
                        <ButtonCore
                            type="secondary"
                            title=""
                            icon={
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    width={"16px"}
                                    height={16}
                                    color="#000"
                                />
                            }
                            onClick={() => {
                                toggle("getLink");
                            }}
                        />
                    </Box>

                    <div className="wrapper-edit-page">
                        <div className="wrapper-from">
                            <Stack
                                direction={"column"}
                                sx={{
                                    width: "100%",
                                    height: "fit-content",
                                }}
                            >
                                <label className="label">Link đặt hẹn</label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    variant="outlined"
                                    value={values}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className="opacity-40"
                                            >
                                                <IconButton
                                                    onClick={handleCopy}
                                                    edge="end"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCopy}
                                                        width={"16px"}
                                                        height={16}
                                                        color="#000"
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "end",
                                paddingTop: "12px",
                                paddingBottom: "24px",
                                width: "100%",
                            }}
                        >
                            <ButtonCore
                                title={T("close")}
                                onClick={() => {
                                    toggle("getLink");
                                }}
                            />
                        </div>
                    </div>
                </>
            </Box>
        </Dialog>
    );
}
