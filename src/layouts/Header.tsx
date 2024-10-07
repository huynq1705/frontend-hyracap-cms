import ButtonCore from "@/components/button/core";
import SearchNormal from "@/components/icons/search";
import UserSection from "@/components/UserSection";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Stack } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import EmptyIcon from "@/components/icons/empty";
import clsx from "clsx";
interface HeaderProps {
    handleDrawerToggle: () => void;
}

const Header = (props: HeaderProps): JSX.Element => {
    const { handleDrawerToggle } = props;
    const { T } = useCustomTranslation();
    const [keySearch, setKeySearch] = useState("");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [listCustomer, setListCustomer] = useState<any>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const navigate = useNavigate();
    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            // Call the onSearch callback with the current search term
            alert("Tính năng đang phát triển");
        }
    };

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
    }, [keySearch]);

    return (
        <Box
            className="flex justify-between items-center w-full space-x-1 flex-wrap gap-3"
            sx={{
                flexDirection: {
                    xs: "",
                },
            }}
        >
            <div className="flex gap-3">
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                        mr: 2,
                        "@media (min-width: 600px)": {
                            display: "none",
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <div className="flex  justify-center items-center ">
                    <Box className="flex-row justify-center items-center relative header-search-box gap-3 flex-1 hidden md:block">
                        <SearchNormal />
                        <input
                            value={keySearch}
                            onChange={(e) => setKeySearch(e.target.value)}
                            placeholder="Tìm nhanh khách hàng"
                            // onKeyDown={handleKeyDown}
                            onFocus={() => setOpenDropdown(true)}
                            onBlur={() =>
                                setTimeout(() => {
                                    setOpenDropdown(false);
                                }, 300)
                            }
                            className="pl-3 min-w-[282px]"
                        />
                        <div
                            className={clsx(
                                "max-h-[180px] hidden bg-white absolute top-[-22px] left-7 right-0 mt-12 border rounded border-solid border-[#CEF5D5]  z-[2] h-[180px] overflow-y-auto  flex-col gap-1 text-sm",
                                openDropdown &&
                                    (keySearch !== "" ||
                                        listCustomer != null) &&
                                    "!flex"
                            )}
                        >
                            {(listCustomer && listCustomer.length) > 0 &&
                                listCustomer.map((x: any) => (
                                    <div
                                        key={x.id}
                                        className="p-2 cursor-pointer hover:bg-[var(--bg-color-primary)]"
                                        onClick={() =>
                                            navigate(
                                                `/admin/customer/view/${x.id}`
                                            )
                                        }
                                    >
                                        <b className="text-[var(--text-color-primary)]">
                                            {x.full_name}
                                        </b>
                                        <p>{x.phone_number}</p>
                                    </div>
                                ))}
                            {(!listCustomer || listCustomer.length == 0) && (
                                <Box
                                    className="w-full text-center pt-4"
                                    sx={{
                                        svg: {
                                            width: "64px",
                                            height: "64px",
                                        },
                                    }}
                                >
                                    <EmptyIcon />
                                    <p>
                                        Không tìm thấy khách hàng trong hệ
                                        thống.
                                        <br />
                                        {/* <b
                      className="text-[var(--text-color-primary)] text-sm underline cursor-pointer"
                      // onClick={() => setPopupCreateCustomer(true)}
                    >
                      Thêm khách hàng
                    </b> */}
                                    </p>
                                </Box>
                            )}
                        </div>
                    </Box>
                </div>
            </div>
            <div className="flex items-center gap-3 ">
                <Box
                    className="flex-row hidden lg:flex"
                    // direction={"row"}
                    sx={{
                        gap: "12px",
                        // flexDirection: 'row'
                    }}
                >
                    {/* <ButtonCore
                        title={T("createCustomer")}
                        type="bgWhite"
                        onClick={() => {
                            navigate("/admin/customer/create");
                        }}
                    />
                    <ButtonCore
                        title={T("createOder")}
                        onClick={() => {
                            navigate("/admin/order/create");
                        }}
                    /> */}
                </Box>
                <Stack
                    className="h-9 w-9 flex items-center justify-center relative bg-[#F9FAFB]"
                    sx={{
                        borderRadius: "8px",
                        border: "1px solid var(--border-color-primary)",
                    }}
                >
                    <FontAwesomeIcon icon={faBell} />
                    <Box className="absolute top-1 right-1 text-xs p-1 bg-red-600 w-4 h-4 rounded-full flex items-center justify-center text-white">
                        9
                    </Box>
                </Stack>
                {/* <LangSection /> */}
                <UserSection />
            </div>
        </Box>
    );
};

export default memo(Header);
