import apiOrderService from "@/api/apiOrder.service";
import ButtonCore from "@/components/button/core";
import EmptyIcon from "@/components/icons/empty";
import { formatCurrency } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { handleGetDataCommon } from "@/utils/fetch";
import { Box, Stack } from "@mui/material";
import { Empty, Table, Typography } from "antd";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface DebtPageProps {}

export default function DebtPage(props: DebtPageProps) {
  const { code } = useParams();
  const [debt, setDebt] = React.useState<any>([]);
  const { getDebt } = apiOrderService();
  const init = () => {
    const convert = (array: any[]) => {
      return array.map((it) => it);
    };
    handleGetDataCommon(getDebt, convert, setDebt, code);
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
        <h3 className="">Công nợ</h3>
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
        <CustomCardList dataConvert={debt} />
        {debt.length < 1 && (
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
          dataSource={debt}
          columns={getColumns()}
          pagination={false}
          scroll={{ x: "100%", y: "calc(100vh - 430px)" }}
          className="custom-table hidden md:block"
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
            <span className="font-medium text-gray-9 text-sm">Mã đơn hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span>{item?.id}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thời gian</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium">
                {" "}
                {formatDate(item?.date, "DDMMYYYY")}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Đơn giá</span>
            <div className="text-gray-9 text-base py-1">
              <span> {formatCurrency(item?.debt ?? 0)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getColumns = () => {
  const navigate = useNavigate();
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
          {formatDate(item?.date, "DDMMYYYY")}
        </Typography.Text>
      ),
      width: 80,
    },

    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {formatCurrency(item?.debt ?? 0)}
        </Typography.Text>
      ),
      width: 80,
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      render: (_: any, item: any, index: number) => (
        <div className="py-2">
          <ButtonCore
            title="Thanh toán nợ"
            onClick={() => {
              navigate(`/admin/order/view/${item?.id}`);
            }}
          />
        </div>
      ),
      width: 50,
    },
  ];
  return columns;
};
