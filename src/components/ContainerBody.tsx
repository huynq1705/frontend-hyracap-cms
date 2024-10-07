import React, { ReactNode, useRef, useState } from "react";
import { styled } from "@mui/system";
import TopTableCustom from "./top-table";
import { Box } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { handleGetKetDown } from "@/utils/filter";
import ButtonCore from "./button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PopupConfirmImport from "./popup/confirm-import";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import PopupConfirmAccept from "@/components/popup/confirm-accept";
import StarIconV2 from "./icons/StarV2";
import CPagination from "./pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducers";
interface ContainerBodyProps {
    children: ReactNode;
}
const BTN_CATEGORY = ["product", "service-list"];

const ContainerBody: React.FC<ContainerBodyProps> = ({ children }) => {
    const navigate = useNavigate();
    const { T, t } = useCustomTranslation();
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const [showGetLink, setShowGetLink] = useState(false);
    const [importPopup, setImportPopup] = useState(false);
    const [exportToExcel, setExportToExcel] = useState("");
    const { key_search } = handleGetKetDown(searchParams);
    const check_actions = pathname.split("/")[2];
    const subTab = useSelector((state: RootState) => state.subTab.subTab);
    const toggleShowGetLink = () => {
        setShowGetLink(!showGetLink);
    };

    return (
        <Box className=" pt-4 p-b-2 flex flex-col gap-6 md:px-4">
            <div className="max-sm:px-4">
                <TopTableCustom
                    actions={{
                        createFn: () => {
                            navigate(`${pathname}/create?${searchParams}`);
                        },
                        downloadFn: () => {
                            setExportToExcel("true");
                        },
                        uploadFn: () => {
                            setImportPopup(true);
                        },
                        getLink: () => {
                            setShowGetLink(true);
                        },
                    }}
                >
                    {BTN_CATEGORY.includes(check_actions) && (
                        <ButtonCore
                            title={"Tạo danh mục " + t(check_actions)}
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            type="bgWhite"
                            onClick={() => {
                                navigate(
                                    `/admin/${check_actions}/add_category?${searchParams}`
                                );
                            }}
                        />
                    )}
                </TopTableCustom>
            </div>
            <div className="relative">
                {children}
                {subTab === false && <CPagination />}
            </div>
            {importPopup && (
                <PopupConfirmImport
                    handleClose={() => {
                        // navigate(pathname.replace(/\/$/, ""));
                        setImportPopup(false);
                    }}
                    open={true}
                />
            )}
            {exportToExcel && (
                <PopupConfirmAccept
                    handleClose={() => {
                        setExportToExcel("");
                    }}
                    open
                    keySearch={key_search}
                />
            )}
        </Box>
    );
};

export default ContainerBody;
