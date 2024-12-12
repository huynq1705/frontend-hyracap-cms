import { Stack, Typography } from "@mui/material";
import * as React from "react";
import ButtonCore from "../button/core";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { useLocation } from "react-router-dom";

export interface ActionsEditPageProps {
    isView?: boolean;
    actions: {
        handelSave: () => void;
        handleCancel: () => void;
    };
    isBigBtn?: boolean;
}

export default function ActionsEditPage(props: ActionsEditPageProps) {
    const { actions, isView, isBigBtn = false } = props;
    const { T } = useCustomTranslation();
    const { pathname } = useLocation();
    const blockBtn = ["contract", "users", "group/view"];
    return (
        <Stack
            className="sticky bottom-0 left-0 right-0"
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={2}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                padding: "12px 16px",
                width: "100%",
                "& button": {
                    width: isBigBtn ? "50% !important" : "fit-content",
                },
            }}
        >
            <ButtonCore
                title={T(isView ? "close" : "cancel")}
                type="bgWhite"
                onClick={actions.handleCancel}
            />
            {!blockBtn.some((btn) => pathname.includes(btn)) && (
                <ButtonCore
                    title={T(isView ? "edit" : "save")}
                    onClick={actions.handelSave}
                />
            )}
        </Stack>
        // </Stack>
    );
}
