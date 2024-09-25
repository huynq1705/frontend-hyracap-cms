import React, { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../edit";
import { Box } from "@mui/material";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "@/utils";
import { removeVietnameseTones } from "@/utils/remove-vietnamese";
import CustomCurrencyInput from "@/components/input-custom-v2/currency";
import ButtonCore from "@/components/button/core";
import QRCode from "../qr-code";
import { ListPrepaidCard, ListTreatmentCard } from "../list-card";
type ItemPaymentMethodProps = {
  data: any[];
  total_amount: number;
  customer_id: number;
  remove: (index: number) => void;
  update: (index: number, value: number) => void;
};
const ItemPaymentMethodItem: React.FC<ItemPaymentMethodProps> = (
  props: ItemPaymentMethodProps,
) => {
  const { total_amount, data, remove, update } = props;
  const [renderQR, setRenderQR] = useState(false);
  const context = useContext(OrderContext);
  const order_id = context?.values.order_id;
  const [itemActiveID, setItemActiveID] = useState(-1);
  useEffect(() => {
    setItemActiveID(data[data.length - 1]?.id ?? -1);
  }, [data.length]);
  return (
    <div className="flex flex-col gap-2">
      {data.map((payment: any, index: number) => {
        const isActive = itemActiveID === payment.id;
        const max_paid =
          total_amount -
          data
            .slice(0, data.length - 1)
            .reduce((max_paid, item) => (max_paid += item.paid), 0);
        return (
          <Box
            key={payment.id}
            className={clsx(
              "w-full  py-3 px-4 flex items-center gap-3 rounded-md cursor-pointer flex-wrap justify-between hover:text-[var(--text-color-primary)] hover:bg-[var(--bg-color-primary)] ",
              isActive && "text-[var(--text-color-primary)]",
              payment.name.toLowerCase().includes("qr") &&
                isActive &&
                "bg-[#F6FAF7]",
            )}
            sx={{
              border: "1px solid #D0D5DD",
              transition: "all 1s linear",
              "&:hover": {
                borderColor: "var(--text-color-primary)",
              },
            }}
            onClick={() => {
              setItemActiveID(payment.id);
            }}
          >
            <b className="text-base font-semibold">{payment.name}</b>
            <Box
              sx={{
                " > svg": {
                  transition: "all 0.3s linear",
                },
              }}
            >
              {/* icon remove */}
              {!payment.order_id && (
                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={() => {
                    remove(index);
                  }}
                />
              )}
              {/* số tiền hiển thị */}
              {payment.order_id &&
                !removeVietnameseTones(payment.name)
                  .toLowerCase()
                  .includes("lieu trinh") && (
                  <div>{formatCurrency(payment?.paid || 0)}</div>
                )}
            </Box>
            {/* thông tin thanh toán */}
            {isActive &&
              !payment.order_id &&
              !["lieu trinh", "tra truoc"].find((x) =>
                removeVietnameseTones(payment.name).toLowerCase().includes(x),
              ) && (
                <div className="w-full flex-wrap flex gap-4 items-center my-3">
                  {/* selling_price */}
                  <p className="w-full">
                    <label className="text-black text-sm">
                      Còn lại :{" "}
                      <b className="text-[var(--text-color-primary)">
                        {formatCurrency(max_paid)}
                      </b>
                    </label>
                  </p>
                  <CustomCurrencyInput
                    label="Số tiền"
                    name="paid"
                    handleChange={(name, value) => {
                      let convert_value = +value;
                      if (max_paid < +value) convert_value = max_paid;
                      update(index, convert_value);
                    }}
                    values={{ paid: payment.paid }}
                    errors={[]}
                    validate={{}}
                    required={[]}
                    configUI={{
                      width: "75%",
                      labelWidth: "30%",
                    }}
                    direction="row"
                    max={max_paid}
                  />
                  {payment.name.toLowerCase().includes("qr") && (
                    <div className="mb-2">
                      <ButtonCore
                        title={renderQR ? "Ẩn" : "Mã QR"}
                        onClick={() => {
                          setRenderQR(!renderQR);
                        }}
                        disabled={!payment.paid}
                      />
                    </div>
                  )}
                </div>
              )}
            {payment.name.toLowerCase().includes("qr") &&
              isActive &&
              renderQR && <QRCode payment={payment} />}
            {removeVietnameseTones(payment.name)
              .toLowerCase()
              .includes("lieu trinh") && (
              <ListTreatmentCard payment={payment} />
            )}
            {removeVietnameseTones(payment.name)
              .toLowerCase()
              .includes("tra truoc") &&
              !payment.order_id && <ListPrepaidCard payment={payment} />}
          </Box>
        );
      })}
    </div>
  );
};
export default ItemPaymentMethodItem;
