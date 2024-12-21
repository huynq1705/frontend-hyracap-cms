import ButtonCore from "@/components/button/core";
import SearchNormal from "@/components/icons/search";
import UserSection from "@/components/UserSection";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { io } from "socket.io-client";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import EmptyIcon from "@/components/icons/empty";
import clsx from "clsx";
import { useSelector } from "react-redux";
import apiAccountService from "@/api/Account.service";
import apiNotificationService from "@/api/notification.service";
import { formatDate, formatTime } from "@/utils/date-time";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { onMessageListener } from "@/utils/firebase";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import AppConfig from "@/common/AppConfig";
interface HeaderProps {
  handleDrawerToggle: () => void;
}

const Header = (props: HeaderProps): JSX.Element => {
  const { handleDrawerToggle } = props;
  const { T } = useCustomTranslation();
  const { getAccount } = apiAccountService();
  const { getNotification } = apiNotificationService();
  const userInfo = useSelector(selectUserInfo);
  const [keySearch, setKeySearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [listCustomer, setListCustomer] = useState<any>(null);
  const [listNotification, setListNotification] = useState<any>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      // Call the onSearch callback with the current search term
      alert("Tính năng đang phát triển");
    }
  };
  const findCustomer = () => {
    getAccount({ text: keySearch, page: 1, take: 999 })
      .then((e) => {
        console.log("jhagdfajdfka", e);
        setListCustomer(e.data);
      })
      .catch((e) => {});
  };
  const getNoti = () => {
    getNotification({ page: 1, take: 999, staffId__eq: userInfo?.id })
      .then((response) => {
        const rawData = response.data;
        const formattedNotifications = rawData.map((item: any) => ({
          id: item.id,
          title: item.notification?.title || "No Title",
          body: item.notification?.body || "No Body",
          time: item.created_at
            ? formatDate(item.created_at, "HHMMvsDDMMYYYY")
            : "Now",
        }));
        setListNotification(formattedNotifications);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getNoti();
    // onMessageListener().then((payload: any) => {
    //   console.log("payload", payload);

    //   dispatch(
    //     setGlobalNoti({
    //       type: "success",
    //       message: `${payload.notification?.title}: ${payload.notification?.body}`,
    //     })
    //   );
    //   setListNotification((prevNotifications: any) => {
    //     const newNotification = {
    //       id: prevNotifications.length ?? 0,
    //       title: payload.notification?.title || "No Title",
    //       body: payload.notification?.body || "No Body",
    //       time: "Now",
    //     };
    //     return [newNotification, ...prevNotifications];
    //   });
    // });
  }, []);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const timeout = setTimeout(() => {
      findCustomer();
    }, 500);

    return () => clearTimeout(timeout);
  }, [keySearch]);

  useEffect(() => {
    const socket = io(AppConfig.WS_URL, {
      path: "/ws",
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("notification", (data) => {
      console.log("Received notification:", data);
      dispatch(
        setGlobalNoti({
          type: "success",
          message: `${data?.title}: ${data?.body}`,
        })
      );
      setListNotification((prevNotifications: any) => {
        const newNotification = {
          id: prevNotifications.length ?? 0,
          title: data?.title || "No Title",
          body: data?.body || "No Body",
          time: "Now",
        };
        return [newNotification, ...prevNotifications];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
                  (keySearch !== "" || listCustomer != null) &&
                  "!flex"
              )}
            >
              {(listCustomer && listCustomer.length) > 0 &&
                listCustomer.map((x: any) => (
                  <div
                    key={x.id}
                    className="p-2 cursor-pointer hover:bg-[var(--bg-color-primary)]"
                    onClick={() => navigate(`/admin/users/view/${x.sub}`)}
                  >
                    <b className="text-[var(--text-color-primary)]">
                      {x.firstName} {x.lastName}
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
                    Không tìm thấy khách hàng trong hệ thống.
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
          <ButtonCore
            title={"Tạo hợp đồng"}
            type="bgWhite"
            onClick={() => {
              navigate("/admin/contract/create");
            }}
          />
          <ButtonCore
            title={"Tạo dự án"}
            onClick={() => {
              navigate("/admin/project/create");
            }}
          />
        </Box>
        {/* <Stack
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
                </Stack> */}
        <Stack
          className="h-9 w-9 flex items-center justify-center relative bg-[#F9FAFB] cursor-pointer"
          sx={{
            borderRadius: "8px",
            border: "1px solid var(--border-color-primary)",
          }}
          onClick={handleOpen}
        >
          <FontAwesomeIcon icon={faBell} />
          <Box className="absolute top-1 right-1 text-xs p-1 bg-red-600 w-4 h-4 rounded-full flex items-center justify-center text-white">
            {(listNotification && listNotification.length) ?? 0}
          </Box>
        </Stack>

        {/* Popover */}
        <Popover
          id={id}
          open={open}
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
          PaperProps={{
            sx: { width: 300, maxHeight: 400, overflow: "hidden" },
          }}
        >
          {/* Tiêu đề cố định */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <Typography variant="h6" sx={{ p: 2 }}>
              Thông báo
            </Typography>
            <Divider />
          </Box>

          {/* Danh sách cuộn */}
          <Box sx={{ maxHeight: 350, overflow: "auto" }}>
            <List>
              {listNotification?.length > 0 ? (
                listNotification.map((noti: any) => (
                  <ListItem
                    key={noti.id}
                    button
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f6faf7",
                      },
                    }}
                  >
                    <ListItemText
                      primary={noti.title}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {noti.body}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {noti.time ?? "--"}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                      secondaryTypographyProps={{
                        fontSize: "12px",
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ p: 2, textAlign: "center" }}>
                  Không có thông báo!
                </Typography>
              )}
            </List>
          </Box>
        </Popover>

        {/* <LangSection /> */}
        <UserSection />
      </div>
    </Box>
  );
};

export default memo(Header);
