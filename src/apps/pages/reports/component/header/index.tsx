import ButtonCore from "@/components/button/core";
import { faAngleRight, faChevronRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { Popover } from "antd";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface HeaderReportProps {
  arrayButtonExport?: { label: string; fn: (...args: any) => void }[];
}
const LIST_TITLE = [
  {
    key: "revenue",
    label: "Báo cáo doanh thu",
  },
  {
    key: "service",
    label: "Báo cáo dịch vụ",
  },
  {
    key: "product",
    label: "Báo cáo sản phẩm",
  },
  {
    key: "commission",
    label: "Báo cáo hoa hồng",
  },
  {
    key: "customer",
    label: "Báo cáo đánh giá khách hàng",
  },
  {
    key: "employee",
    label: "Báo cáo đánh giá khách hàng",
  },
  {
    key: "order",
    label: "Chi tiết báo cáo đơn hàng",
  },
  {
    key: "prepaid_card",
    label: "Chi tiết báo cáo thẻ trả trước",
  },
  {
    key: "treatments",
    label: "Chi tiết báo cáo thẻ liệu trình",
  },
  {
    key: "payment",
    label: "Chi tiết báo cáo phương thức thanh toán",
  },
];

const LIST_PAGE = [
  {
    key: "order",
    label: "Chi tiết báo cáo đơn hàng",
  },
  {
    key: "prepaid_card_face",
    label: "Chi tiết báo cáo thẻ trả trước",
  },
  {
    key: "treatments",
    label: "Chi tiết báo cáo thẻ liệu trình",
  },
  {
    key: "payment",
    label: "Chi tiết báo cáo phương thức thanh toán",
  },
];

const btnStyleBgWhite = {
  backgroundColor: "var(--btn-color-secondary)",
  color: "var(--btn-color-primary)",
};
export default function HeaderReport(props: HeaderReportProps) {
  const navigate = useNavigate();
  const { arrayButtonExport } = props;
  const { pathname } = location;
  const data = LIST_TITLE.find((x) => pathname.includes(x.key)) ?? {
    key: "- -",
    label: "- -",
  };
  const data_page = LIST_PAGE.find((x) => pathname.includes(x.key)) ?? {
    key: "- -",
    label: "- -",
  };
  const [arrow, setArrow] = useState("Show");

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }

    if (arrow === "Show") {
      return true;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);
  const content = (
    <div>
      {arrayButtonExport &&
        arrayButtonExport.map((it) => (
          <Box
            className="p-2 hover:text-[var(--text-color-primary)] cursor-pointer"
            key={it.label}
            onClick={it.fn}
          >
            {it.label}
          </Box>
        ))}
    </div>
  );
  return (
    <div className="w-full !h-fit ">
      {/* {LIST_PAGE.find(page => pathname.includes(page.key)) && (
        <div className="flex items-center gap-3 py-3 px-5 text-sm bg-white">
          <b onClick={() => {navigate("/admin/report-revenue")}}
            className="text-[var(--text-color-primary)] cursor-pointer">Báo cáo doanh thu</b>
          <FontAwesomeIcon icon={faAngleRight} />
          <span>{data_page.label}</span>
        </div>
      )} */}

      {/* <div className="w-full flex justify-between items-center py-6 px-4"> */}
      <div className="flex flex-wrap items-start gap-3 sm:flex-row justify-between py-6 px-4 ">
        <h2>{data.label}</h2>
        {arrayButtonExport?.length == 1 ? (

          <div
            className="flex items-center button-core"
            style={btnStyleBgWhite}
            onClick={arrayButtonExport[0].fn}
          >
            <FontAwesomeIcon icon={faDownload} />
            Tải xuống
          </div>
        )
          :
          <Popover
            placement="bottomRight"
            content={content}
            arrow={mergedArrow}
          >
            <div
              className="flex items-center button-core"
              style={btnStyleBgWhite}
            >
              <FontAwesomeIcon icon={faDownload} />
              Tải xuống
            </div>
          </Popover>
        }
      </div>
    </div>
  );
}
