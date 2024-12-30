import palette from "@/theme/palette-common";
import { Box, Stack } from "@mui/material";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export interface MemberCardProps {
  data?: any;
}

export default function MemberCard(props: MemberCardProps) {
  const { data } = props;
  const navigate = useNavigate();

  console.log("data", data);
  return (
    <Stack
      direction={"row"}
      spacing={"6px"}
      alignItems={"center"}
      borderRadius={4}
      p={1}
      bgcolor={palette.bgPrimary}
      sx={{
        width: "100%",
      }}
      onClick={() => {
        navigate(`/admin/staff/view/${data?.members_staff_id}`);
      }}
    >
      <Stack
        direction={"column"}
        gap={1}
        sx={{
          color: "var(--text-color-three)",
          minWidth: "80px",
        }}
        className={clsx("px-2 py-1 w-fit h-fit cursor-pointer")}
      >
        <Stack
          direction={"row"}
          gap={1}
          className={clsx("items-center text-xs capitalize ")}
        >
          <Box
            className="w-2 h-2 rounded-full"
            sx={{
              backgroundColor: "var(--success-color)",
            }}
          ></Box>
          {"Mã nhân viên : " + data?.members_staff_id}
        </Stack>
        <Stack
          direction={"row"}
          gap={1}
          className={clsx("items-center text-xs capitalize ")}
        >
          <Box
            className="w-2 h-2 rounded-full"
            sx={{
              backgroundColor: "var(--success-color)",
            }}
          ></Box>
          {"Chức vụ : " + (+data?.role === 1 ? "Nhân viên" : "Quản lý")}
        </Stack>
        <Stack
          direction={"row"}
          gap={1}
          className={clsx("items-center text-xs capitalize ")}
        >
          <Box
            className="w-2 h-2 rounded-full"
            sx={{
              backgroundColor: "var(--success-color)",
            }}
          ></Box>
          {"Họ tên : " +
            data?.members_first_name +
            " " +
            data?.members_last_name}
        </Stack>
        <Stack
          direction={"row"}
          gap={1}
          className={clsx("items-center text-xs capitalize ")}
        >
          <Box
            className="w-2 h-2 rounded-full"
            sx={{
              backgroundColor: "var(--success-color)",
            }}
          ></Box>
          {"Email : " + data?.members_email}
        </Stack>
        <Stack
          direction={"row"}
          gap={1}
          className={clsx("items-center text-xs capitalize ")}
        >
          <Box
            className="w-2 h-2 rounded-full"
            sx={{
              backgroundColor: "var(--success-color)",
            }}
          ></Box>
          {"SĐT : " + data?.members_phone}
        </Stack>
      </Stack>
    </Stack>
  );
}
