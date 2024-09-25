import React from "react";
import EmptyIcon from "@/components/icons/empty";
import StatusCardV2 from "@/components/status-card/index-v2";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { handleGetDataCommon } from "@/utils/fetch";
import { Box, Rating } from "@mui/material";
import { Empty, Table, Tooltip, Typography } from "antd";
import { useParams } from "react-router-dom";
import apiOrderService from "@/api/apiOrder.service";
export interface TreatmentHistoryProps {}

export default function TreatmentHistory(props: TreatmentHistoryProps) {
  const { code } = useParams();
  const { getHistoryService } = apiOrderService();
  const [treatmentHistory, setTreatmentHistory] = React.useState<any>([]);
  const [statistical, setStatistical] = React.useState({
    total_card: "0",
    active_card: "0",
    expired_card: "0",
    total_sessions: 0,
    available_sessions: 0,
    expired_sessions: 0,
  });
  const init = async () => {
    try {
      const data = await getHistoryService(
        `/order-detail-treatment/payment/history?customer_id=${code}`,
      );
      if (data.statusCode == 200 && data.data.table)
        setTreatmentHistory(data.data.table);
      if (data.statusCode == 200 && data.data.statistic)
        setStatistical(data.data.statistic);
    } catch (err) {
      throw err;
    }
  };
  React.useEffect(() => {
    init();
  }, []);
  return (
    <div className="px-4">
      {/* header */}
      <Box
        className="pb-4 flex justify-between items-center"
        sx={{
          borderBottom: "1px solid #D0D5DD",
        }}
      >
        <div className="flex gap-4 flex-wrap">
          <StatusCardV2
            statusData={{
              label: "Tổng số thẻ  :",
              value: statistical.total_card,
              color: "#0D63F3",
            }}
            hightLine="label"
          />
          <StatusCardV2
            statusData={{
              label: "Số thẻ đang hoạt động:",
              value: statistical.active_card,
              color: "#217732",
            }}
            hightLine="label"
          />
          <StatusCardV2
            statusData={{
              label: "Số thẻ hết hạn:",
              value: statistical.expired_card,
              color: "#D83D32",
            }}
            hightLine="label"
          />
          <StatusCardV2
            statusData={{
              label: "Tổng số buổi:",
              value: (statistical.total_sessions),
              color: "#0D63F3",
            }}
            hightLine="label"
          />
          <StatusCardV2
            statusData={{
              label: "Số buổi khả dụng:",
              value: statistical.available_sessions,
              color: "#50945D",
            }}
            hightLine="label"
          />
          <StatusCardV2
            statusData={{
              label: "Số buổi hết hạn:",
              value: statistical.expired_sessions,
              color: "#D83D32",
            }}
            hightLine="label"
          />
        </div>
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
        {/* <CustomCardList dataConvert={treatmentHistory} /> */}
        {treatmentHistory.length < 1 && (
          <Empty
            className="hidden max-sm:block w-full justify-center items-center"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        <Table
          size="middle"
          locale={{
            emptyText: (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col">
                  <EmptyIcon />
                  <p className="text-center mt-3">Không có dữ liệu</p>
                </div>
              </div>
            ),
          }}
          bordered
          dataSource={treatmentHistory}
          columns={getColumns()}
          pagination={false}
          scroll={{ x: "100%", y: "calc(100vh - 430px)" }}
          className="custom-table-customer hidden md:block"
        />
      </Box>
    </div>
  );
}
const getColumns = () => {
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {index + 1}
        </Typography.Text>
      ),
      width: 46,
    },
    {
      title: "Tên thẻ",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.order_detail_information?.order_detail?.name}
        </Typography.Text>
      ),
      width: 109,
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {formatDate(item?.created_at, "DDMMYYYYvsHHMM")}
        </Typography.Text>
      ),
      width: 150,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.order?.id}
        </Typography.Text>
      ),
      width: 109,
    },
    {
      title: "dịch vụ",
      dataIndex: "service",
      render: (_: any, item: any, index: number) => {
        const tooltip =
          item?.order?.order_detail
            ?.filter((x: any) => x.service_id)
            ?.map((x: any) => x.name)
            ?.join(", ") ?? "- -";
        const content =
          tooltip.length > 20 ? tooltip.slice(0, 30) + "..." : tooltip;
        return (
          <Typography.Text
            style={{
              fontSize: "14px",
            }}
          >
            <Tooltip placement="topLeft" title={tooltip}>
              {content}
            </Tooltip>
          </Typography.Text>
        );
      },
      width: 180,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {formatCurrency(item?.money_spent ?? 0)}
        </Typography.Text>
      ),
      width: 148,
    },
    {
      title: "Số dư khả dụng",
      dataIndex: "remaining_amount",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {formatCurrency(item?.remaining_amount ?? 0)}
        </Typography.Text>
      ),
      width: 148,
    },
  ];
  return columns;
};
