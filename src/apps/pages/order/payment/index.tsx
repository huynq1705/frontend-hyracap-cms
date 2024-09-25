import * as React from "react";
import styles from "@/assets/styles/create-order.module.scss";
import { useTheme } from "@mui/material/styles";
import TabPanel from "@/components/tab-panel";
import clsx from "clsx";
import ProductPicked from "../components/product-picked";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import CStatus from "@/components/status";
import { formatCurrency } from "@/utils";
import { Box } from "@mui/material";
import { OrderContext } from "../edit";
import ItemPaymentMethodItem from "../components/payment-method-item";
import DataMethod from "../components/data-method";
import { useNavigate } from "react-router-dom";
export interface PaymentStepProps {
  index: number;
  flagPayment: boolean;
  statusOrder: "unfinished" | "create" | "unpaid" | "paid";
}

export default function PaymentStep(props: PaymentStepProps) {
  const { index, flagPayment, statusOrder } = props;
  const navigate = useNavigate();

  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const actions = context?.actions;
  const order_id = context?.values.order_id;
  const theme = useTheme();
  const DATA_PAYMENT_METHOD =
    orderCurrent?.payment_methods?.map((x: any) => ({
      ...x,
    })) ?? [];
  const handleRemoveMethod = (index: number) => {
    const new_list_payment_method = (
      orderCurrent?.payment_methods ?? []
    ).filter((x: any, i: number) => {
      if (x.order_id) return true;
      return i !== index;
    });
    actions &&
      actions.handleChangeOrder("payment_methods", new_list_payment_method);
  };
  const handleUpdateMethod = (index: number, value: number) => {
    const new_list_payment_method = orderCurrent?.payment_methods
      ? orderCurrent.payment_methods.map((x: any, i: number) =>
          index === i ? { ...x, paid: +value } : x,
        )
      : [];
    actions &&
      actions.handleChangeOrder("payment_methods", new_list_payment_method);
  };
  let TITLE = (
    <>
      <FontAwesomeIcon icon={faAngleLeft} />
      Trở về giỏ hàng
    </>
  );
  const handleCheck = () => {
    let methods = orderCurrent?.payment_methods ?? [];
    if (order_id) methods = methods?.filter((x) => !x.order_id);
    return methods?.every((x) => !x.paid);
  };
  const checkActiveBtn = handleCheck();
  if (order_id)
    TITLE = (
      <div className="flex items-center w-full">
        <div
          className="flex-grow flex items-center gap-3"
          onClick={() => {
            statusOrder === "unfinished" &&
              actions &&
              actions.setStep("create");
          }}
        >
          {statusOrder === "unfinished" && (
            <FontAwesomeIcon icon={faAngleLeft} />
          )}
          <span>Đơn hàng {order_id}</span>
          <CStatus
            type={statusOrder === "paid" ? "success" : "warning"}
            name={
              statusOrder === "paid"
                ? "Đã thanh toán"
                : statusOrder === "unpaid"
                ? "Chưa hoàn thành"
                : "Chưa thanh toán"
            }
          />
        </div>
        <div className="flex gap-3 w-1/4 justify-end">
          <ButtonCore
            title="In phiếu tạm"
            type="bgWhite"
            styles={{
              width: "45%",
            }}
            onClick={() => {
              actions && actions.handleSetPopups("preview_invoice", true);
            }}
          />
          <ButtonCore
            title="Đánh giá"
            type="bgWhite"
            styles={{
              fontSize: "10px !important",
              width: window.innerWidth > 1348 ? "30%" : "40%",
            }}
            onClick={() => {
              const path = `/evaluate/${order_id}`;
              window.open(window.location.origin + path, "_blank");
            }}
          />
          {!flagPayment && (
            <ButtonCore
              title="Hoàn thành"
              styles={{
                width: "45%",
              }}
              onClick={() => actions && actions.handleCreateOrder(true)}
              disabled={checkActiveBtn}
            />
          )}
        </div>
      </div>
    );

  return (
    <>
      <TabPanel value={index} index={index} dir={theme.direction}>
        <TabPanel
          key={`order-${index + 1}`}
          value={index}
          index={index}
          dir={theme.direction}
          className={clsx(
            styles.content_create_wrapper,
            "h-full bg-[#F9FAFB] px-5 py-6",
          )}
        >
          <h2
            className="text-lg font-medium mb-3 cursor-pointer flex gap-3 items-center"
            onClick={() => actions && actions.setStep("create")}
          >
            {TITLE}
          </h2>
          <div className={styles.content_create}>
            {/* chọn sản phẩm */}
            <div
              className={clsx(
                statusOrder === "paid" ? "w-1/3" : "!hidden",
                styles.item,
              )}
            >
              <div className={clsx(styles.item_head)}>
                Sản phẩm chọn mua ({orderCurrent?.itemPicked.length})
              </div>
              <div className="">
                <ProductPicked type="view" />
              </div>
            </div>
            {/* chọn phương thức thanh toán */}
            <div
              className={clsx(
                statusOrder === "paid" && "!hidden",
                "w-1/4",
                styles.item,
              )}
            >
              <div className={clsx(styles.item_head)}>
                Phương thức thanh toán
              </div>
              <DataMethod />
            </div>
            {/* phương thức thanh toán */}
            <div
              className={clsx(
                statusOrder === "paid" ? "w-1/3" : "w-1/2 overflow-y-auto ",
                styles.item,
              )}
            >
              <div className={clsx(styles.item_head)}>Lịch sử thanh toán</div>
              <div className="flex flex-col gap-2 mt-3 overflow-y-auto">
                <ItemPaymentMethodItem
                  data={DATA_PAYMENT_METHOD}
                  total_amount={orderCurrent?.payment?.total || 0}
                  customer_id={orderCurrent?.customer?.id ?? 0}
                  remove={handleRemoveMethod}
                  update={handleUpdateMethod}
                />
              </div>
            </div>
            <Box
              className={clsx(
                statusOrder === "paid" ? "w-1/3" : "w-1/4",
                " bg-white overflow-y-auto",
                !order_id && "h-full justify-between flex flex-col",
              )}
              sx={{
                maxHeight: "calc(100vh - 180px)",
                borderLeft: "1px solid #ccc",
              }}
            >
              {/* thông tin thanh toán */}
              <div
                className={clsx(
                  "w-full flex flex-col gap-2 relative",
                  styles.item,
                  styles.item3,
                )}
              >
                <div className={clsx(styles.item_head)}>
                  Thông tin thanh toán
                </div>
                {/* total*/}
                <div className="flex justify-between items-center my-3 ">
                  <span>Thành tiền</span>
                  <b className="text-[var(--text-color-primary)] text-2xl">
                    {formatCurrency(orderCurrent?.payment?.total ?? 0)}
                  </b>
                </div>
                {/* line */}
                <div className="h-[2px] w-full bg-[#D0D5DD]"></div>
                {/* tổng tiền sản phẩm */}
                <div className="flex justify-between items-center mt-3">
                  <span>Tổng tiền ban đầu</span>
                  <b className="text-black">
                    {formatCurrency(orderCurrent?.payment?.sum_order ?? 0)}
                  </b>
                </div>
                {/* VAT */}
                <div className="flex justify-between items-center mt-3">
                  <span>VAT</span>
                  <b className="text-black">
                    {`${orderCurrent?.payment?.VAT ?? 0} % , ${formatCurrency(
                      orderCurrent?.payment?.vat ?? 0,
                    )}`}
                  </b>
                </div>
              </div>
              {/* btn actions */}
              {!order_id && (
                <div
                  className={clsx(
                    "flex-grow px-1 py-3 flex justify-center gap-x-2 items-end ",
                  )}
                >
                  <div
                    className={clsx(
                      "flex-grow flex justify-center gap-2 items-end flex-wrap",
                    )}
                  >
                    <ButtonCore
                      title="Lưu lại"
                      type="bgWhite"
                      styles={{
                        fontSize: "10px !important",
                        width: window.innerWidth > 1348 ? "30%" : "40%",
                      }}
                      onClick={() =>
                        actions && actions.handleCreateOrder(false)
                      }
                    />
                    <ButtonCore
                      title="In phiếu tạm"
                      type="bgWhite"
                      styles={{
                        fontSize: "10px !important",
                        width: window.innerWidth > 1348 ? "30%" : "40%",
                      }}
                      onClick={() => {
                        actions &&
                          actions.handleSetPopups("preview_invoice", true);
                      }}
                    />
                    {!!order_id && (
                      <ButtonCore
                        title="Đánh giá"
                        type="bgWhite"
                        styles={{
                          fontSize: "10px !important",
                          width: window.innerWidth > 1348 ? "30%" : "40%",
                        }}
                        onClick={() => navigate(`/evaluate/${order_id}`)}
                      />
                    )}
                    <ButtonCore
                      title="Hoàn thành"
                      styles={{
                        fontSize: "10px !important",
                        width: window.innerWidth > 1348 ? "30%" : "40%",
                      }}
                      onClick={() => actions && actions.handleCreateOrder(true)}
                      disabled={checkActiveBtn}
                    />
                  </div>
                </div>
              )}
            </Box>
          </div>
        </TabPanel>
      </TabPanel>
    </>
  );
}
