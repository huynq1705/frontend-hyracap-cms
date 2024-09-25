import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import clsx from "clsx";
import _ from "lodash";
import styles from "@/assets/styles/create-order.module.scss";
import MyTextField from "@/components/input-custom-v2/text-field";
import { DataTypeOrder, ItemOrder } from "@/types/order";
import { formatCurrency } from "@/utils";
import { Button } from "../item-card";
import apiCustomerService from "@/api/apiCustomer.service";
import PopupCreateCustomer from "../popup";
import { OrderContext } from "../../edit";
import EmptyIcon from "@/components/icons/empty";
const KEY_REQUIRED = ["name", "original_price", "selling_price"];
const VALIDATE = {
  name: "Hãy nhập tên sản phẩm",
  original_price: "Hãy nhập giá",
  selling_price: "Hãy nhập giá",
};
interface InfoPaymentProps {
  type?: "control" | "view";
}
const INIT_DATA = {
  email: "",
  phone_number: "",
  full_name: "",
};
export default function InfoPayment(props: InfoPaymentProps) {
  const { type = "view" } = props;
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const data = context?.values?.data;
  const actions = context?.actions;
  const [openDropdown, setOpenDropdown] = useState(false);
  const [formData, setFormData] = useState<any>(INIT_DATA);
  const [showBtnCustomer, setShowBtnCustomer] = useState(false);
  const [VAT, setVAT] = useState<any>(8);
  const [isCustomerExist, setIsCustomerExist] = useState(true);
  const [popupCreateCustomer, setPopupCreateCustomer] = React.useState(false);
  const [account, setAccount] = useState<any[]>([]);
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
  const handleOnchange = (e: any) => {
    const { name, value, checked } = e.target;
    setOpenDropdown(true);
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setShowBtnCustomer(false);
  };
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
    if (orderCurrent?.customer?.id) setIsCustomerExist(true);
    if (condition) setVAT(condition);
  }, [orderCurrent]);
  const handlePickAccount = (data: any) => {
    setFormData({
      email: data?.email ?? "",
      phone_number: data?.phone_number ?? "",
      full_name: data?.full_name ?? "",
    });
    actions &&
      actions.handleChangeOrder("customer", {
        email: data?.email ?? "",
        phone_number: data?.phone_number ?? "",
        full_name: data?.full_name ?? "",
        id: data?.id ?? 0,
      });
    setOpenDropdown(false);
  };
  return (
    <>
      <Box className="h-full relative ">
        <div className={clsx(styles.item_head)}>Thông tin khách hàng</div>
        {type === "view" && <div></div>}
        <>
          <div className="h-fit my-3 flex gap-3 items-center">
            <Button
              name="Khách hàng hệ thống"
              isActive={isCustomerExist}
              onClick={() => setIsCustomerExist((prev) => !prev)}
            />
            {/* 
            <Button
              name="Khách hàng lẻ"
              isActive={!isCustomerExist}
              onClick={() => {
                setIsCustomerExist((prev) => !prev);
                actions && actions.handleChangeOrder("customer", {});
                setFormData(INIT_DATA);
              }}
            /> */}
          </div>
          {isCustomerExist && (
            <div className="mt-3 flex flex-col">
              {/* phone_number */}
              <div className="relative">
                <MyTextField
                  label=""
                  errors={[]}
                  required={KEY_REQUIRED}
                  configUI={{}}
                  name="phone_number"
                  placeholder="Nhập SĐT"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                />
                <div
                  className={clsx(
                    "max-h-[180px] bg-white absolute top-0 left-0 right-0 mt-12 rounded-xl border border-solid border-[var(--text-color-primary)] hidden z-[2] h-[180px] overflow-y-auto  flex-col gap-1 text-sm",
                    openDropdown && "!flex",
                  )}
                >
                  {!!account.length &&
                    account.map((x) => (
                      <div
                        key={x.id}
                        className="p-2 hover:bg-[var(--bg-color-primary)]"
                        onClick={() => handlePickAccount(x)}
                      >
                        <b className="text-[var(--text-color-primary)]">
                          {x.full_name}
                        </b>
                        <p>{x.phone_number}</p>
                      </div>
                    ))}
                  {!account.length && (
                    <Box
                      className="w-full text-center"
                      sx={{
                        svg: {
                          width: "60px",
                        },
                      }}
                    >
                      <EmptyIcon />
                      <p>
                        Không tìm thấy khách hàng trong hệ thống.
                        <br />
                        <b
                          className="text-[var(--text-color-primary)] text-sm underline cursor-pointer"
                          onClick={() => setPopupCreateCustomer(true)}
                        >
                          Thêm khách hàng
                        </b>
                      </p>
                    </Box>
                  )}
                </div>
              </div>
              {/* email */}
              <MyTextField
                label=""
                errors={[]}
                required={KEY_REQUIRED}
                configUI={{}}
                name="email"
                placeholder="Nhập email KH"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={true}
              />
              {/* full_name */}
              <MyTextField
                label=""
                errors={[]}
                required={KEY_REQUIRED}
                configUI={{}}
                name="full_name"
                placeholder="Nhập tên KH"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={true}
              />
            </div>
          )}
          {showBtnCustomer && (
            <div className="my-2 flex gap-3 text-[var(--error-color)] text-xs hidden">
              <p>
                Không tìm thấy khách hàng trong hệ thống.
                <b
                  className="text-[var(--text-color-primary)] text-sm underline cursor-pointer"
                  onClick={() => setPopupCreateCustomer(true)}
                >
                  Thêm khách hàng
                </b>
              </p>
              {/* <ButtonCore title="Thêm khách hàng" /> */}
            </div>
          )}
        </>
        {/*  */}
        <>
          <div className={clsx(styles.item_head)}>Thông tin thanh toán</div>
          {/*  */}
          <div className="flex justify-between items-center my-3 ">
            <span>Tạm tính</span>
            <b className="text-[var(--text-color-primary)]">
              {formatCurrency(valueCalculator.total)}
            </b>
          </div>
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
        </>
      </Box>
      <PopupCreateCustomer
        onClose={() => {
          setPopupCreateCustomer(false);
        }}
        open={popupCreateCustomer}
        handleCreateSuccess={handleCreateSuccess}
        phone_number={formData.phone_number}
      />
    </>
  );
}
interface BonusItemProps {
  title: string;
  bonusPercent: number;
  price: number;
  onChangeBonusPercent: (bonusPercent: number) => void;
}
const BonusItem: React.FC<BonusItemProps> = (props: BonusItemProps) => {
  const { title, bonusPercent, price, onChangeBonusPercent } = props;

  return (
    <div className="w-full mt-3 flex justify-between items-center">
      <span>{title}</span>
      <div className="flex gap-2">
        <div className="flex h-7 w-fit items-center px-[2px] rounded-[4px] border-[#D0D5DD] border-solid border-[1px] text-sm">
          <input
            type="number"
            placeholder="Nhập"
            className="border-none w-14 focus:outline-none"
            step={0.1}
            max={100}
            min={0}
            value={bonusPercent}
            onChange={(e) => onChangeBonusPercent(+e.target.value)}
          />
          <span className="text-sm">%</span>
        </div>
        <div className="h-7 w-[122px] rounded-[4px] border-[#D0D5DD] border-solid border-[1px] text-sm bg-[#F2F4F7] flex justify-between items-center px-2">
          {price ? (
            formatCurrency(price)
          ) : (
            <>
              {"- - "}
              <span>VND</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export { BonusItem };
