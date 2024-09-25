import * as React from "react";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { useLocation } from "react-router-dom";
import { getKeyPage } from "@/utils";
export interface HeaderModalEditProps {
    onClose: () => void;
}

export default function HeaderModalEdit(props: HeaderModalEditProps) {
    const { onClose } = props;
    const { T, t } = useCustomTranslation();
    const { pathname } = useLocation();
    const title_page_btn = t(getKeyPage(pathname, "key"));
    const title = React.useMemo(() => {
        let prefix = "Chi tiết";
        if (pathname.includes("edit")) prefix = "Chỉnh sửa";
        if (pathname.includes("create")) prefix = "Thêm mới";
        if (pathname.includes("list")) prefix = "Danh sách";
        return prefix + " " + t(title_page_btn);
    }, [pathname]);
    return (
        <Box
            className="flex px-4 py-3 justify-between items-center sticky top-0 left-0 w-[101%] !bg-white z-[4]"
            sx={{
                border: "1px solid var(--border-color-primary)",
            }}
        >
            <h3>{title}</h3>
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
                onClick={onClose}
            />
        </Box>
    );
}
