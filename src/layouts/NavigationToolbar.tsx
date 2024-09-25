import { Toolbar } from "@mui/material";
import { memo } from "react";
import { Link } from "react-router-dom";
import logo1 from "@/assets/images/logo/logo-1.svg";
import logo from "@/assets/images/logo/logo.svg";
import clsx from "clsx";
interface NavigationToolbarProps {
  isOpen?: boolean;
  isHover?: boolean;
}
const NavigationToolbar = (props: NavigationToolbarProps): JSX.Element => {
  const { isOpen, isHover } = props;

  return (
    <Toolbar className="w-full flex justify-flex-start items-center select-none pt-5 pl-4">
      <Link to="/admin">
        <img
          src={!isOpen && !isHover ? logo : logo1}
          width={!isOpen ? 60 : 120}
          height={48}
          className={clsx(
            "w-full max-width-[120px] ",
            !isOpen ? "max-sm:hidden" : "",
          )}
        />
      </Link>
    </Toolbar>
  );
};

export default memo(NavigationToolbar);
