import apiOrderService from "@/api/apiOrder.service";
import { ListCard } from "@/components/list-card";

import { formatCurrency } from "@/utils";

import { handleGetDataCommon } from "@/utils/fetch";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { Empty } from "antd";
import clsx from "clsx";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface TagServicePageProps {}

export default function TagServicePage(props: TagServicePageProps) {
  const navigate = useNavigate();
  const { code } = useParams();
  const [treatmentCard, setTreatmentCard] = useState<any[]>([]);
  const [prepaidCard, setPrepaidCard] = useState<any[]>([]);
  const { getServiceCard } = apiOrderService();
  const init = () => {
    if (!code) return;
    const convertTreatment = (array: any[]) => {
      return array.map((it) => {
        const dateNow = new Date();
        const dateExpiration = new Date(it.expiration_date);
        const result: any = {
          type: dateNow < dateExpiration,
          name: it.order_detail.name,
          payment: {
            amount: {
              value: it.number_of_remaining_treatments,
              title: "Số buổi còn lại",
              color: "#7A52DE",
            },
            total: {
              value:
                it.number_of_treatment_used + it.number_of_remaining_treatments,
              title: "Tổng số buổi",
            },
            collect: {
              value: it.number_of_treatment_used,
              title: "Đã sử dụng",
            },
            price: {
              value: formatCurrency(it.unit_price),
              title: "Tổng tiền",
            },
          },
          use_date: it.expiration_date,
        };
        return result;
      });
    };
    const convertPrepaid = (array: any[]) => {
      return array.map((it) => {
        const dateNow = new Date();
        const dateExpiration = new Date(it.expiration_date);
        const result: any = {
          type: dateNow < dateExpiration,
          name: it.order_detail.name,
          payment: [
            {
              title: "Số dư khả dụng",
              value: formatCurrency(it.remaining_amount_of_prepaid_card),
              color: "#7A52DE",
            },
            {
              title: "Tổng tiền",
              value: formatCurrency(it.unit_price),
            },
            {
              title: "Đã sử dụng",
              value: formatCurrency(it.amount_used),
            },
          ],
          use_date: it.expiration_date,
        };
        return result;
      });
    };
    handleGetDataCommon(
      () => getServiceCard(+code, "treatment"),
      convertTreatment,
      setTreatmentCard,
    );
    handleGetDataCommon(
      () => getServiceCard(+code, "prepaid"),
      convertPrepaid,
      setPrepaidCard,
    );
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      {/* header */}
      <Box
        className="pb-4 flex justify-between items-center"
        sx={{
          borderBottom: "1px solid #D0D5DD",
        }}
      >
        <h3 className="">Thẻ dịch vụ</h3>
      </Box>
      {/* content */}
      <Box
        className="flex flex-wrap px-2 items-center mt-4"
        sx={{
          maxHeight: "calc(100vh - 380px)",
          overflowY: "auto",
          gap: "24px",
        }}
      >
        <ListCard
          title="Thẻ trả trước"
          data={prepaidCard}
          directionHistory={() => {
            navigate(`/admin/customer/view/history-service-prepaid/${code}`);
          }}
          width="calc(33% - 16px)"
        />
        {prepaidCard.length < 1 && (
          <Empty
            className="w-full justify-center items-center"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có thẻ"
          />
        )}
        <ListCard
          title="Thẻ liệu trình"
          data={treatmentCard}
          directionHistory={() => {
            navigate(`/admin/customer/view/history-service-treatment/${code}`);
          }}
          width="calc(33% - 16px)"
        />
        {treatmentCard.length < 1 && (
          <Empty
            className="w-full justify-center items-center"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có thẻ"
          />
        )}
      </Box>
    </div>
  );
}
