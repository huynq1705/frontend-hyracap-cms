import * as React from "react";
import styles from "@/assets/styles/create-order.module.scss";
import { useTheme } from "@mui/material/styles";
import TabPanel from "@/components/tab-panel";
import clsx from "clsx";
import ButtonCore from "@/components/button/core";
import { OrderContext } from "../edit";
import InfoPayment from "../components/info-payment";
import ProductPicked from "../components/product-picked";
import DataProduct from "../components/data-product";

export interface CreateStepProps {
  index: number;
  statusOrder: "unfinished" | "create" | "unpaid" | "paid";
  setStep: (step: any) => void;
}

export default function CreateStep(props: CreateStepProps) {
  const { index, statusOrder, setStep } = props;
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const theme = useTheme();

  const handleCheckDisableBTN = () => {
    if (!orderCurrent?.itemPicked?.length) return true;
    const isCheckCardExist = orderCurrent?.itemPicked.find((x: any) =>
      ["prepay", "course"].includes(x?.type),
    );
    if (isCheckCardExist || !orderCurrent?.customer?.id) return true;
    return false;
  };
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
          <h2 className="text-lg font-medium mb-3 cursor-pointer flex gap-3 items-center">
            <div className="flex items-center w-full gap-2">
              <span className="text-lg font-medium mb-1">Giỏ hàng</span>
              {/* <FontAwesomeIcon icon={faAngleRight} /> */}
            </div>
            {statusOrder === "unfinished" && (
              <div>
                <ButtonCore
                  title="Thông tin thanh toán"
                  onClick={() => {
                    setStep("payment");
                  }}
                />
              </div>
            )}
          </h2>

          <div className={styles.content_create}>
            <div className={clsx("w-1/3", styles.item)}>
              <div className={clsx(styles.item_head)}>Danh sách sản phẩm</div>
              <DataProduct />
            </div>
            <div className={clsx("w-1/3 ", styles.item)}>
              <div className={clsx(styles.item_head)}>
                Sản phẩm chọn mua ({orderCurrent?.itemPicked.length})
              </div>
              <ProductPicked />
            </div>
            <div
              className={clsx(
                "w-1/3 flex flex-col gap-2 relative justify-between",
                styles.item,
                styles.item3,
              )}
            >
              <div
                className={clsx(
                  "flex flex-col gap-2 relative overflow-y-auto",
                  styles.item,
                  styles.item3,
                )}
              >
                <InfoPayment />
              </div>
              <div
                className={clsx(
                  styles.btn,
                  "h-16 px-4 py-3",
                  statusOrder != "create" && "hidden",
                )}
              >
                <ButtonCore
                  title="Tạo đơn"
                  styles={{
                    width: "100%",
                    height: "100%",
                  }}
                  onClick={() => {
                    setStep("payment");
                  }}
                  disabled={handleCheckDisableBTN()}
                />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanel>
    </>
  );
}
