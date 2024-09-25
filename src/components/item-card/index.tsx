import { formatDate } from "@/utils/date-time";
import { Box } from "@mui/material";
import clsx from "clsx";

const CardItem: React.FC<any> = (props: any) => {
  const { type, name, payment, use_date, id } = props.data;
  let styleStatus = {
    backgroundColor: type ? "#F3F7FE" : "#FEF6F5",
    color: type ? "#0D63F3" : "#F04438",
    borderColor: type ? "#0D63F3" : "#F04438",
    border: "1px solid",
  };
  const status = type ? "Đang sử dụng" : "Đã hết hạn mức";
  return (
    <div
      className={clsx(
        "shadow p-3 h-full rounded-xl border border-solid border-[transparent]",
        type ? "bg-[#F9F7FF]" : "bg-[#F9FAFB]",
        "min-w-[calc(33.333%-16px)] max-sm:w-full",
        props.id == id && "!border-[blue]",
      )}
      onClick={() => {
        type && id && props?.onClick(id);
      }}
    >
      <div
        className={clsx("flex justify-between items-center gap-3 rounded-xl")}
      >
        <p className="font-semibold text-sm text-[#1D2939]">{name}</p>
        <Box
          sx={styleStatus}
          className="px-2 py-1 rounded-lg text-xs flex items-center justify-between gap-2"
        >
          <div
            className={clsx(
              "h-2 w-2 rounded-full",
              type ? "bg-[#0D63F3]" : "bg-[#F04438]",
            )}
          ></div>
          {status}
        </Box>
      </div>
      {/*  */}
      {use_date && (
        <RowCard
          data={{
            title: `HSD: ${formatDate(use_date ?? "09/09/2001", "DDMMYYYY")}`,
          }}
        />
      )}

      <div className="h-[2px] w-full bg-[#DBCEFD] my-1"></div>
      {payment &&
        Object.keys(payment).map((it) => <RowCard data={payment[it]} />)}
    </div>
  );
};
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
export default CardItem