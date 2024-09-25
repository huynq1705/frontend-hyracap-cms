import StatusCardV2 from "@/components/status-card/index-v2";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import clsx from "clsx";

type RowCardProps = {
  title: string;
  data: any[];
  title_detail?: string;
  fn?: (...args: any) => void;
};
const RowCard: React.FC<RowCardProps> = (props: RowCardProps) => {
  const { data, title, title_detail, fn } = props;
  // console.log({ fn });
  return (
    <div
      className={clsx(
        "flex justify-between items-center my-2 gap-4  w-full flex-wrap",
      )}
    >
      <div className="flex items-center gap-4">
        <h3>{title}</h3>
        {title_detail && (
          <>
            <div className="!w-[2px] h-5 bg-[#D0D5DD]"></div>
            <p
              className="text-[var(--text-color-primary)] text-sm cursor-pointer"
              onClick={() => fn && fn()}
            >
              {title_detail}
              <FontAwesomeIcon
                icon={faAngleRight}
                className="ml-2 inline-block h-[14px]"
              />
            </p>
          </>
        )}
      </div>
      <Box className="flex w-full gap-4 flex-wrap">
        {data.map((x) => (
          <StatusCardV2 key={x.label} statusData={x} customCss="lg:w-[calc(33%-8px)] sm:w-[calc(50%-8px)] sm sm:min-w-[250.6px] max-sm:w-full" />
        ))}
      </Box>
    </div>
  );
};
export default RowCard;
