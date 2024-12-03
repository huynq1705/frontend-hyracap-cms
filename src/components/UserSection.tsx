import useCustomTranslation from "@/hooks/useCustomTranslation";
import { LoginRounded } from "@mui/icons-material";
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Tooltip,
} from "@mui/material";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTwoLetters from "./UserTwoLetters";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const UserSection = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const userInfo = useSelector(selectUserInfo);
  console.log("userInfo", userInfo);

  const { T } = useCustomTranslation();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    navigate("/admin/login");
  };

  const menuDefine = [
    {
      label: T("logout"),
      icon: <LoginRounded />,
      onClick: handleLogout,
    },
  ];
  return (
    <>
      <Tooltip title={userInfo?.email} disableInteractive>
        <Button
          className="w-auto animate-fadeleft !rounded-lg"
          onClick={handleClick}
        >
          <div className="flex items-center space-x-2">
            <UserTwoLetters />
            <div
              className="flex flex-row items-center justify-between gap-4"
              // style={{ minWidth: "120px" }}
            >
              <span className="!text-black !font-bold hidden lg:inline-block">
                {`${userInfo?.first_name}` + ` ` + `${userInfo?.last_name}`}
              </span>
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </div>
        </Button>
      </Tooltip>
      <Popover
        id={!!anchorEl ? "user-menu" : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Paper>
          <MenuList dense>
            {menuDefine.map((item, i) => (
              <MenuItem key={i} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popover>
    </>
  );
};

export default memo(UserSection);
