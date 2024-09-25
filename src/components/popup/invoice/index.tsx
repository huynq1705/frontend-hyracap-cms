import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { formatCurrency } from "@/utils";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import logo1 from "@/assets/images/logo/logo-1.svg";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import clsx from "clsx";
import apiCompanyService from "@/api/apiCompany";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupInvoiceOrderProps {
  open: boolean;
  onClose: () => void;
  content: {
    listProduct: {
      name: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    customer: {
      full_name: string;
      email: string;
      phone_number: string;
      id?: string;
    };
    employee: {
      name: string;
    };
    code_order?: string | number;
    payment: {
      total: number;
      vat: number;
      sum_order: number;
      VAT: number;
      method: string;
    };
  };
}
function PopupInvoiceOrder(props: PopupInvoiceOrderProps) {
  const { code_order, customer, employee, listProduct, payment } =
    props.content;
  const { onClose, open } = props;
  const [info, setInfo] = React.useState<any>(null);
  const { getCompanyDetail } = apiCompanyService();
  function getFormattedDateTime(): string {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  }
  const now_date = getFormattedDateTime();
  const getDetailCompany = async () => {
    try {
      const response = await getCompanyDetail(1);

      if (response.data) setInfo(response.data);
    } catch (e) {
      throw e;
    }
  };
  React.useEffect(() => {
    getDetailCompany();
  }, []);
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        fullWidth
        maxWidth={"md"}
        fullScreen={window.innerWidth < 768}
        sx={{
          ".MuiPaper-root": {
            backgroundColor: "transparent",
            borderRadius: " none",
          },
        }}
      >
        <div className="min-w-[30vw] bg-white rounded-xl text-sm invoice-wrapper">
          {/* header */}
          <div
            className="p-4 flex justify-between items-center "
            style={{
              borderBottom: "1px solid #D0D5DD",
            }}
          >
            <b className="text-xl">Xem trước phiếu tạm</b>
            <button
              className="bg-transparent border-none cursor-pointer"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {/* title */}
          <img
            src={logo1}
            width={120}
            height={48}
            className={clsx("w-full max-width-[120px] mt-3")}
          />
          <div className="text-center mt-4 mb-6">
            <h2 className="text-base">HÓA ĐƠN BÁN HÀNG</h2>
            <p className="">
              Ngày in:{now_date} <br /> Mã ĐH: {code_order} - Ngày: {now_date}
            </p>
          </div>
          {/* employee */}
          <div
            className="px-4 py-2.5"
            style={{
              borderBottom: "1px solid #D0D5DD",
              borderTop: "1px solid #D0D5DD",
            }}
          >
            <span className="inline-block w-[140px]">Nhân viên thực hiện</span>{" "}
            :{employee.name}
          </div>
          {/* customer */}
          {customer?.id ? (
            <div className="px-4 py-2 flex flex-col gap-1">
              <p>
                <span className="inline-block w-[140px]">Khách hàng</span>:
                {customer?.full_name}
              </p>
              <p>
                <span className="inline-block w-[140px]">Số điện thoại</span>:
                {customer?.phone_number}
              </p>
              <p>
                <span className="inline-block w-[140px]">Email</span>:
                {customer?.email}
              </p>
            </div>
          ) : (
            <div className="px-4 py-2 flex flex-col gap-1">
              <p>
                <span className="inline-block w-[140px]">Khách hàng</span>:
                Khách lẻ
              </p>
            </div>
          )}

          {/* table */}
          <div className="p-4">
            <table className="custom-table-invoice w-full">
              <colgroup>
                <col width={"40%"} />
                <col width={"20%"} />
                <col width={"20%"} />
                <col width={"20%"} />
              </colgroup>
              <tr>
                <th>DV/SP</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
              {listProduct.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </table>
          </div>

          {/* total */}
          <div className="p-4 flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <b>{formatCurrency(payment?.sum_order ?? 0)}</b>
            </div>

            <div className="flex justify-between">
              <span>VAT</span>
              <b>{`${payment?.VAT ?? 0} % : ${formatCurrency(
                payment?.vat ?? 0,
              )} `}</b>
            </div>
            <div className="flex justify-between">
              <span>Tổng cộng</span>
              <b>{formatCurrency(payment?.total ?? 0)}</b>
            </div>
            <div className="flex justify-between">
              <span>Phương thức thanh toán</span>
              <b>{payment?.method}</b>
            </div>
          </div>
          {/* note */}
          <div
            className="px-4 py-1"
            style={{
              borderTop: "1px solid black",
              borderBottom: "1px solid black",
            }}
          >
            <b>Ghi chú</b>
            <p className="mt-1">- - - -</p>
          </div>
          {/*  */}
          <div className="text-center py-4 flex flex-col gap-1">
            <h2 className="text-base">CHĂM SÓC SỨC KHỎE CỘNG ĐỒNG</h2>
            <p>{info?.address ?? "76 Nguyễn Chí Thanh"}</p>
            <p>Số điện thoại: {info?.phone_number ?? "0367093876"}</p>
            <p>Website: {info?.website ?? "mitu.com"}</p>
          </div>
          {/* qr */}
          <div
            className="flex justify-center
           items-center"
          >
            <div className="flex gap-10 max-md:justify-between">
              <div className="flex flex-col gap-4 items-center">
                <QRCodeCanvas
                  value={`http://103.3.246.216:4002/evaluate/${code_order}`}
                  size={86}
                />
                <b>Đánh giá</b>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <QRCodeCanvas value={`http://103.3.246.216:4002`} size={86} />
                <b>Đặt hẹn</b>
              </div>
            </div>
          </div>
          {/* btn */}
          <Stack
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={"12px"}
            width={"100%"}
            sx={{
              padding: "12px 24px 24px",
            }}
          >
            <ButtonCore title={"Hủy"} type="bgWhite" onClick={onClose} />

            <ButtonCore
              title={"In hóa đơn"}
              onClick={() => {}}
              icon={<FontAwesomeIcon icon={faPrint} />}
            />
          </Stack>
          {/* end */}
        </div>
      </Dialog>
    </>
  );
}
export default React.memo(PopupInvoiceOrder);
