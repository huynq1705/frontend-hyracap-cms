import CTableRevenue from "./order";
import { useParams } from "react-router-dom";
import HeaderReport from "../../component/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Box, Container } from "@mui/material";
import CTableOder from "./order";
import CTableTreatments from "./treatments";
import CTablePayment from "./payment";
import CTablePrepaidCard from "./prepaidCardFace";

export interface DetailsPageProps { }

const LIST_PAGE: Record<string, JSX.Element> = {
  order: <CTableOder />,
  prepaid_card: <CTablePrepaidCard />,
  treatments: <CTableTreatments />,
  payment: <CTablePayment />,
};

export default function DetailsPage(props: DetailsPageProps) {
  const { page } = useParams<{ page: string }>();

  // const name = page=="prepaid_card" return "Chi tiết báo cáo thẻ trả trước"
  return (
    <>
      <Box className="relative h-full overflow-y-auto">
      {/* <Box className="relative flex flex-col h-[100vh] pb-[env(safe-area-inset-bottom)]"> */}
        {/* <div className="flex items-center gap-3 py-3 px-5 text-sm bg-white">
          <b onClick={() => history.back()}
            className="text-[var(--text-color-primary)] cursor-pointer">Báo cáo doanh thu</b>
          <FontAwesomeIcon icon={faAngleRight} />
          <span>{page ?? "- -"}</span>

        </div> */}
        {/* <div
          className=""
          style={{
            // maxHeight: "calc(100vh - 210px)",
          }}
        > */}

          {page && LIST_PAGE[page]}
        {/* </div> */}
      </Box>

    </>
  );
}
