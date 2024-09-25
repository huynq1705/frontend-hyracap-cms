import React, { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/utils";
import CountdownTimer from "../coundown";
import { DATA_BANK } from "@/constants/bank";

interface QRCodeProps {
  payment: any;
  expirationTime?: number;
}
const initDataQR = (payment: any) => {
  return [
    {
      label: "Ngân hàng",
      key: "bank",
      value:
        payment?.bank?.full_name ??
        "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
      code: payment?.bank?.name ?? "MBBank",
    },
    {
      label: "Số tài khoản",
      key: "stk",
      value: payment?.number_account ?? "--",
    },
    {
      label: "Chủ tài khoản",
      key: "other",
      value: payment?.name_account ?? "- -",
    },
    {
      label: "Nội dung giao dịch:",
      key: "content",
      value: "Thanh toan don hang",
    },
  ];
};
const QRCode: React.FC<QRCodeProps> = ({ payment, expirationTime = 10 }) => {
  const [QR_url_image, setQR_url_image] = useState("");
  const [endTime, setEndTime] = useState(false);

  const DATA = initDataQR(payment);
  const getQR = async () => {
    try {
      const url = `https://qr.sepay.vn/img?bank=${DATA[0].code}&acc=${DATA[1].value}&amount=${payment.paid}&des=${DATA[3].value}`;
      const response = await fetch(url);
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(
          `Failed to retrieve the image. Status code: ${response.status}`,
        );
      }
      // Convert the binary data to a blob
      const blob = await response.blob();
      // Create a URL for the blob
      const imageUrl = URL.createObjectURL(blob);
      setQR_url_image(imageUrl);
      // return imageUrl;
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    getQR();
  }, [payment]);
  console.log("payment", payment);
  if (endTime) return <p className="text-red-400">Hết hạn</p>;
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <p className="text-[#475467]">Giao dịch hết hạn sau</p>
        <CountdownTimer
          initialMinutes={15}
          initialSeconds={0}
          setEndTime={() => {
            setEndTime(true);
          }}
        />
      </div>
      <div className="flex w-full mt-4 flex-wrap">
        <div className="w-1/2 rounded-lg border-solid border-[1px] border-[var(--text-color-primary)] flex justify-center items-center py-4 max-md:w-full">
          <div className="flex flex-col gap-3 items-center">
            <p className="w-3/4 text-center text-[#475467]">
              Quét mã qua <b> Ứng dụng Ngân hàng </b> hoặc <b>Ví điện tử</b>
            </p>
            <img src={QR_url_image} className="w-3/4" />
          </div>
        </div>
        <div className="w-1/2 px-4 flex flex-col gap-5 max-md:w-full max-md:mt-4">
          <div className="flex flex-col">
            <span className="text-[#475467]">Tổng tiền</span>
            <b className="text-[var(--text-color-primary)]">
              {formatCurrency(payment.paid)}
            </b>
          </div>
          {DATA.map((it) => (
            <div className="flex flex-col" key={it.key}>
              <span className="text-[#475467]">{it.label}</span>
              <b className="text-[#1D2939]">{it.value}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCode;
