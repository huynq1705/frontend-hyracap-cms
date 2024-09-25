import { formatCurrency } from "@/utils";
import React, { useEffect, useMemo, useState } from "react";
import { BonusItem } from "../components/info-payment";
import { OrderContext } from "../edit";
import apiCustomerService from "@/api/apiCustomer.service";
import ButtonCore from "@/components/button/core";
import {
  faChevronDown,
  faChevronUp,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Box } from "@mui/material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import PopupPickProduct from "./components/popup-pick-product";
import PopupCreateCustomer from "../components/popup";
import CreateStepMobile from "./components/create";
import PaymentStepMobile from "./components/payment";
import PopupPickMethod from "./components/popup-pick-method";
import PopupInvoiceOrder from "@/components/popup/invoice";
import { useNavigate } from "react-router-dom";

const INIT_DATA = {
  email: "",
  phone_number: "",
  full_name: "",
};
export interface MobileEditMobileProps {
  handleCreateContentInvoice: any;
  removeOrder: any;
  setStep: (step: any) => void;
  step: "create" | "payment";
  statusOrder: "create" | "unfinished" | "unpaid" | "paid";
}
export default function MobileEditMobile(props: MobileEditMobileProps) {
  const {
    step,
    setStep,
    statusOrder,
    handleCreateContentInvoice,
    removeOrder,
  } = props;
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const data = context?.values?.data;
  const actions = context?.actions;
  const [formData, setFormData] = useState<any>(INIT_DATA);
  const [VAT, setVAT] = useState<any>(8);
  const [account, setAccount] = useState<any[]>([]);
  const [isUpPayment, setIsUpPayment] = useState(false);
  const [popupCreateCustomer, setPopupCreateCustomer] = React.useState(false);
  const navigate = useNavigate();
  const [popup, setPopup] = useState({
    listProduct: false,
    listMethod: false,
    previewInvoice: false,
  });
  const handleCreateSuccess = (data: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
  }) => {
    setFormData(data);
    actions && actions.handleChangeOrder("customer", data);
  };
  const { getCustomer } = apiCustomerService();
  const calculator = () => {
    let sum_order = 0;
    let vat = 0;
    if (orderCurrent?.itemPicked && orderCurrent.itemPicked.length) {
      sum_order = orderCurrent.itemPicked.reduce((sum, item) => {
        const price_item =
          (data &&
            data[item.type].source.find((it) => it.value === item.id)
              ?.selling_price) ??
          0;

        return (sum += item.quantity * price_item);
      }, 0);
      vat = (sum_order * VAT) / 100;
    }
    actions &&
      actions.handleChangeOrder("payment", {
        total: vat + sum_order,
        vat,
        sum_order,
        VAT,
      });
    return {
      total: vat + sum_order,
      vat,
      sum_order,
    };
  };
  const valueCalculator = useMemo(
    () => calculator(),
    [orderCurrent?.itemPicked, VAT, orderCurrent?.itemPicked.length],
  );
  const onChangeBonusPercent = (value: number) => {
    setVAT(value);
  };
  const handleCheckCustomer = async () => {
    try {
      const param: any = {
        page: 1,
        take: 999,
      };
      const setDataNotExist = {
        full_name: "",
        email: "",
        phone_number: formData.phone_number,
      };
      if (formData.phone_number) {
        param.filter = `phone_number__like__${formData.phone_number}`;
      }
      const response = await getCustomer(param);
      if (response && response.data) {
        setAccount(response.data);
      } else {
        setFormData(setDataNotExist);
      }
    } catch (e) {
      throw e;
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleCheckCustomer();
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.phone_number]);
  useEffect(() => {
    const condition = orderCurrent?.payment?.VAT;
    if (orderCurrent?.customer?.id) setFormData(orderCurrent.customer);
    if (condition) setVAT(condition);
  }, [orderCurrent]);
  const togglePopup = (name: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const actions_list = [
    {
      icon: <FontAwesomeIcon icon={faCreditCard} />,
      name: "Phương thức thanh toán",
      onClick: () => {
        togglePopup("listMethod");
      },
    },
  ];
  const handleCheckDisableBTN = () => {
    if (!orderCurrent?.itemPicked?.length) return true;
    const isCheckCardExist = orderCurrent?.itemPicked.find((x: any) =>
      ["prepay", "course"].includes(x?.type),
    );
    if (isCheckCardExist && !orderCurrent?.customer?.id) return true;
    return false;
  };

  return (
    <div className="relative overflow-y-hidden h-[calc(100vh - 64px)]  bg-green-300">
      <Box
        className="bg-[#F2F4F7] overflow-y-auto"
        sx={{
          height: "calc(100vh - 110px)",
          maxHeight: "calc(100vh - 10px)",
        }}
      >
        {step === "create" && (
          <CreateStepMobile
            setStep={setStep}
            toggleDataProductMobile={() => {
              togglePopup("listProduct");
            }}
          />
        )}
        {step === "payment" && (
          <PaymentStepMobile setStep={setStep} statusOrder={statusOrder} />
        )}
      </Box>
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 px-3 shadow-100 transition-default h-auto bg-white",
          statusOrder !== "paid" && "!hidden",
        )}
      >
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
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 px-3 shadow-100 transition-default h-auto bg-white",
          statusOrder === "paid" && "!hidden",
        )}
      >
        <div
          className="flex justify-between items-center my-3"
          onClick={() => setIsUpPayment(!isUpPayment)}
        >
          <span>Tạm tính</span>
          <FontAwesomeIcon icon={isUpPayment ? faChevronDown : faChevronUp} />
          <b className="text-[var(--text-color-primary)]">
            {formatCurrency(valueCalculator.total)}
          </b>
        </div>
        <div
          className={clsx(
            isUpPayment ? "h-[150px] opacity-100" : "h-0 opacity-0",
            "transition-default",
          )}
        >
          <div className="h-[2px] w-full bg-[#D0D5DD]"></div>
          <div className="flex justify-between items-center mt-3">
            <span>Tổng tiền ban đầu</span>
            <b className="text-black">
              {formatCurrency(valueCalculator.sum_order)}
            </b>
          </div>
          {/*  */}
          <BonusItem
            title="VAT"
            onChangeBonusPercent={onChangeBonusPercent}
            price={valueCalculator.vat}
            bonusPercent={VAT}
          />
          <div className="mt-3 my-2">
            {step == "payment" && (
              <div className="flex justify-between">
                <ButtonCore
                  title="In phiếu tạm"
                  type="bgWhite"
                  styles={{
                    fontSize: "10px !important",
                    width: window.innerWidth > 1348 ? "30%" : "40%",
                  }}
                  onClick={() => {
                    actions && actions.handleSetPopups("preview_invoice", true);
                  }}
                />
                <ButtonCore
                  title="Hoàn thành"
                  styles={{
                    fontSize: "10px !important",
                    width: window.innerWidth > 1348 ? "30%" : "40%",
                  }}
                  onClick={() => actions && actions.handleCreateOrder(true)}
                  disabled={!orderCurrent?.payment_methods?.length}
                />
              </div>
            )}
            {step == "create" && (
              <ButtonCore
                title="Tiếp tục"
                styles={{
                  width: "100%",
                  height: "48px",
                }}
                onClick={() => {
                  props.setStep("payment");
                }}
                disabled={handleCheckDisableBTN()}
              />
            )}
          </div>
        </div>
      </div>
      {popup.listProduct && (
        <PopupPickProduct
          toggleDataProductMobile={() => {
            togglePopup("listProduct");
          }}
        />
      )}
      {popup.listMethod && (
        <PopupPickMethod
          toggleDataMethodMobile={() => {
            togglePopup("listMethod");
          }}
        />
      )}
      <PopupCreateCustomer
        onClose={() => {
          setPopupCreateCustomer(false);
        }}
        open={popupCreateCustomer}
        handleCreateSuccess={handleCreateSuccess}
        phone_number={formData.phone_number}
      />
      {statusOrder !== "paid" && step == "payment" && (
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{
            position: "absolute",
            bottom: "28vh",
            right: 16,
            width: "36px",
            height: "36px",
            "> button ": {
              width: "100%",
              height: "100%",
              svg: {
                color: "white",
              },
            },
          }}
          icon={<SpeedDialIcon />}
        >
          {actions_list.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      )}
      {popup.previewInvoice && (
        <PopupInvoiceOrder
          content={handleCreateContentInvoice()}
          open={popup.previewInvoice}
          onClose={() => {
            togglePopup("previewInvoice");
            removeOrder();
            navigate("/admin/order");
          }}
        />
      )}
    </div>
  );
}
