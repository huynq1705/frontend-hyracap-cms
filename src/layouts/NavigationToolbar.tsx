import { Toolbar } from "@mui/material";
import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import logo1 from "@/assets/images/logo/logo-hyracap-1.svg";
import logo from "@/assets/images/logo/logo-hyracap-1.svg";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { setLogo } from "@/redux/slices/logo.slice";
import { selectLogo } from "@/redux/selectors/logo.slice";
interface NavigationToolbarProps {
    isOpen?: boolean;
    isHover?: boolean;
}
const NavigationToolbar = (props: NavigationToolbarProps): JSX.Element => {
    const { isOpen, isHover } = props;
    const logoPage = useSelector(selectLogo);
    const dispatch = useDispatch();

    return (
        <Toolbar
            className={clsx(
                "w-full flex justify-flex-start items-center select-none ",
                !isOpen && !isHover && "!p-0 !pl-2 !py-1"
            )}
        >
            <Link to="/admin">
                <img
                    src={
                        !isOpen && !isHover
                            ? logo
                            : logoPage.max
                            ? import.meta.env.VITE_APP_URL_IMG + logoPage.max
                            : logo1
                    }
                    width={!isOpen ? 60 : 120}
                    height={48}
                    className={clsx(
                        "w-full max-width-[120px] ",
                        !isOpen ? "max-sm:hidden" : ""
                    )}
                />
            </Link>
        </Toolbar>
    );
};

export default memo(NavigationToolbar);
