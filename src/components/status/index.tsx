import { Box } from "@mui/material";
import clsx from "clsx";

export interface CStatusProps {
  type?: "success" | "error" | "warning" | "info";
  name?: string;
}

export default function CStatus(props: CStatusProps) {
  const { type = "success", name } = props;
  let backgroundColor = "";
  let color = "";
  let title = name ?? "active";
  if (type === "success") {
    backgroundColor = "var(--bg-color-primary)";
    color = "var(--success-color)";
  }
  if (type === "error") {
    backgroundColor = "#F9FAFB";
    color = "#98A2B3";
  }
  if (type === "warning") {
    backgroundColor = "#FFF9F3";
    color = "var(--warning-color)";
  }
  if (type === "info") {
    backgroundColor = "rgba(179, 35, 88,0.1)";
    color = "rgb(179, 35, 88)";
  }
  return (
    <Box
      sx={{
        backgroundColor,
        color,
        border: "1px solid",
        borderColor: color,
        minWidth: "80px",
      }}
      className={clsx(
        "rounded-lg flex flex-row gap-2 px-2 py-1 w-fit h-fit items-center text-xs capitalize ",
      )}
    >
      <Box
        className="w-2 h-2 rounded-full"
        sx={{
          backgroundColor: color,
        }}
      ></Box>
      {title}
    </Box>
  );
}
