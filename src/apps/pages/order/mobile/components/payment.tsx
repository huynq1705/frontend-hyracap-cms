import { faChevronLeft, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";
import ItemPaymentMethodItem from "../../components/payment-method-item";
import { OrderContext } from "../../edit";
import CStatus from "@/components/status";

export interface PaymentStepMobileProps {
  setStep: (step: any) => void;
  statusOrder: "create" | "unfinished" | "unpaid" | "paid";
}

export default function PaymentStepMobile(props: PaymentStepMobileProps) {
  const { statusOrder } = props;
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const actions = context?.actions;
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
  return (
    <div>
      <div className="py-2 flex justify-center items-center">
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
      <div
        className="flex p-4 items-center justify-between"
        onClick={() => props.setStep("payment")}
      >
        <div className="w-1/3">
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <h3>Thanh toán</h3>
        <div className="w-1/3 text-right">
          <button
            className="text-[#667085] border-none bg-transparent"
            onClick={() => {
              statusOrder == "unfinished" &&
                actions &&
                actions.handleCreateOrder(false);
              statusOrder != "unfinished" && true;
            }}
          >
            {statusOrder == "unfinished" ? "Lưu đơn hàng" : "In hóa đơn"}
          </button>
        </div>
      </div>
      <div className="">
        <ItemPaymentMethodItem
          data={DATA_PAYMENT_METHOD}
          total_amount={orderCurrent?.payment?.total || 0}
          customer_id={orderCurrent?.customer?.id ?? 0}
          remove={handleRemoveMethod}
          update={handleUpdateMethod}
        />
      </div>
    </div>
  );
}
