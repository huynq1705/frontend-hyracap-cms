import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import apiCommonService from "@/api/apiCommon.service";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import icon from "@/assets/icons/warning.svg";
import WarningIcon from "@/components/icons/warning";
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupConfirmRemoveProps {
    refetch?: () => void;
    handleClose: () => void;
    open: boolean;
    listItem: React.Key[];
    name_item: string[];
    end_point?: string;
}
function PopupConfirmRemove(props: PopupConfirmRemoveProps) {
    const { handleClose, open, listItem, refetch, name_item, end_point } =
        props;
    const { deleteCommon } = apiCommonService();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { pathname } = useLocation();
    const urlPayload = getKeyPage(end_point ?? pathname, "key");
    const handleRemove = async () => {
        const payload = listItem.map((item) => item.toString());
        try {
            const response = await deleteCommon(payload, urlPayload);
            if (!response)
                return dispatch(
                    setGlobalNoti({
                        type: "error",
                        message: `Xóa ${T(urlPayload)} thất bại`,
                    })
                );
            // ---- success
            refetch ? refetch() : "";
            handleClose();
            navigate(pathname);
            dispatch(
                setGlobalNoti({
                    type: "success",
                    message: `Xóa ${T(urlPayload)} thành công`,
                })
            );
        } catch (e) {
            throw e;
        }
    };

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Box className="popup-remove-wrapper ">
                    <Stack
                        direction={"row"}
                        sx={{
                            width: "100%",
                            justifyContent: "flex-end",
                            padding: "16px 22px 16px 16px",
                        }}
                    >
                        <ButtonCore
                            title=""
                            type="secondary"
                            onClick={handleClose}
                            icon={<FontAwesomeIcon icon={faXmark} />}
                        />
                    </Stack>
                    <WarningIcon />
                    <h2 className=" text-center max-w-sm text-base px-6">{`Bạn có chắc chắn muốn xóa ${t(
                        urlPayload
                    )} ${name_item.join(", ")}?`}</h2>
                    <p className="px-6">
                        Lưu ý, hành động này không thể hoàn tác
                    </p>
                    <Stack
                        direction={"row"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        gap={"12px"}
                        width={"100%"}
                        sx={{
                            padding: "12px 24px 24px",
                        }}
                    >
                        <ButtonCore
                            title={T("cancel")}
                            type="bgWhite"
                            onClick={handleClose}
                            styles={{
                                width: "calc(50% - 6px)",
                            }}
                        />

                        <ButtonCore
                            title={T("confirm")}
                            onClick={handleRemove}
                            styles={{
                                width: "calc(50% - 6px)",
                            }}
                        />
                    </Stack>
                </Box>
            </Dialog>
        </>
    );
}
export default React.memo(PopupConfirmRemove);
