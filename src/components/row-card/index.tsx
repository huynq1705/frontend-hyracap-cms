import { Box } from "@mui/material";
import clsx from "clsx";

type RowCardProps = {
  data: {
    title: string;
    value?: string;
    color?: string;
  };
};
const RowCard: React.FC<RowCardProps> = (props: RowCardProps) => {
  const { title, value, color = "#000" } = props.data;
  return (
    <div
      className={clsx(
        "flex justify-between items-center my-2 gap-4",
        value ? "text-sm" : "text-xs",
      )}
    >
      <span>{title}</span>
      <Box
        component={"b"}
        className="font-semibold"
        sx={{ color, fontSize: value ? "16px" : "14px" }}
      >
        {value}
      </Box>
    </div>
  );
};
export default RowCard;
