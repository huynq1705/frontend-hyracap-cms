import apiOrderService from "@/api/apiOrder.service";
import EmptyIcon from "@/components/icons/empty";
import StatusCardV2 from "@/components/status-card/index-v2";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { handleGetDataCommon } from "@/utils/fetch";
import { Box, Rating } from "@mui/material";
import { Empty, Table, Tooltip, Typography } from "antd";
import * as React from "react";
import { useParams } from "react-router-dom";
export interface HistoryOrderPageProps {}

export default function HistoryOrderPage(props: HistoryOrderPageProps) {
  const { code } = useParams();
  const [orderHistory, setServiceHistory] = React.useState<any>([]);
  const {  getOrder } = apiOrderService();
  const [statistical, setStatistical] = React.useState({
    count_used: 0,
    price_used: 0,
    avg_price_use: 0,
  });
  const init = async () => {
    const convert = (array: any[]) => {
      return array.map((it) => it);
    };
    const getData = () =>
      getOrder({
        page: 1,
        take: 999,
        filter: `customer_id__eq__${code}`,
      });
    const data = await handleGetDataCommon(
      getData,
      convert,
      setServiceHistory,
      code,
    );
    if (Array.isArray(data)) {
      const count_used = data.length;
      const price_used = data.reduce((sum, it) => (sum += it.total), 0);
      const avg_price_use = price_used / count_used;
      const new_statistical = {
        count_used,
        price_used,
        avg_price_use,
      };
      setStatistical(new_statistical);
    }
  };
  React.useEffect(() => {
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
        <h3 className="">Lịch sử đơn hàng</h3>
        <div className="flex gap-4">
          <StatusCardV2
            statusData={{
              label: "Số đơn hàng :",
              value: statistical.count_used,
              color: "#0D63F3",
            }}
            hightLine="label"
            direction="row"
          />
          <StatusCardV2
            statusData={{
              label: "Tổng tiền đã tiêu:",
              value: formatCurrency(statistical.price_used),
              color: "#217732",
            }}
            hightLine="label"
            direction="row"
          />
          <StatusCardV2
            statusData={{
              label: "Chi tiêu TB:",
              value: formatCurrency(statistical.avg_price_use),
              color: "#7A52DE",
            }}
            hightLine="label"
            direction="row"
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
        <CustomCardList dataConvert={orderHistory} />
        {orderHistory.length < 1 && (
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
          dataSource={orderHistory}
          columns={getColumns()}
          pagination={false}
          scroll={{ x: "100%", y: "calc(100vh - 430px)" }}
          className="custom-table-customer hidden md:block"
        />
      </Box>
    </div>
  );
}

const CustomCardList = ({ dataConvert }: any) => {
  return (
    <div className=" flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item.id}
          className="border border-solid border-gray-4 shadow rounded-lg mb-4"
        >
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thời gian</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatDate(item?.day, "DDMMYYYY")}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã đơn hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Đơn giá</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium">
                {" "}
                {formatCurrency(item?.price ?? 0)}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">VAT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.VAT ?? "- -"} %</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Số lượng</span>
            <div className="text-gray-9 text-base py-1">
              <span> {item?.quantity ?? "- -"}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">PTTT</span>
            <div className="text-gray-9 text-base py-1">
              <span>Ví Momo</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Tổng tiền</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {formatCurrency(
                  item?.price * item?.quantity * (1 + item.VAT / 100) ?? 0,
                )}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">PTTT</span>
            <div className="text-gray-9 text-base py-1">
              <span>Ví Momo</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Ghi chú</span>
            <div className="text-gray-9 text-base py-1">
              <span> {item?.note ?? "- -"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

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
          {item?.id}
        </Typography.Text>
      ),
      width: 109,
    },
    {
      title: "Sản phẩm",
      dataIndex: "sl",
      render: (_: any, item: any, index: number) => {
        const tooltip = item?.order_detail.map((x: any) => x.name).join(", ");
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
      title: "Giá tạm tính",
      dataIndex: "price",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {formatCurrency(item?.provisional ?? 0)}
        </Typography.Text>
      ),
      width: 148,
    },
    {
      title: "VAT",
      dataIndex: "VAT",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.VAT ?? "- -"} %
        </Typography.Text>
      ),
      width: 54,
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.order_detail.length ?? "- -"}
        </Typography.Text>
      ),
      width: 81,
    },
    {
      title: "PTTT",
      dataIndex: "sl",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.payment_methods_detail
            .map((x: any) => x.payment_methods.name)
            .join(", ") ?? "- -"}
        </Typography.Text>
      ),
      width: 120,
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
          {formatCurrency(item?.total ?? 0)}
        </Typography.Text>
      ),
      width: 148,
    },
    {
      title: "Đánh giá",
      dataIndex: "total",
      render: (_: any, item: any, index: number) => (
        <Rating
          name="half-rating-read"
          value={item?.average_score ?? 0}
          precision={0.5}
          readOnly
        />
      ),
      width: 130,
    },
    {
      title: "Phản hồi",
      dataIndex: "note",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.note ?? "- -"}
        </Typography.Text>
      ),
      width: 120,
    },
  ];
  return columns;
};
