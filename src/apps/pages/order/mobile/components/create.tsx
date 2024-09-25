import { formatCurrency } from "@/utils";
import React, { useEffect, useMemo, useState } from "react";
import { BonusItem } from "../../components/info-payment";
import { OrderContext } from "../../edit";
import apiCustomerService from "@/api/apiCustomer.service";
import ButtonCore from "@/components/button/core";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Box } from "@mui/material";

import MyTextField from "@/components/input-custom-v2/text-field";
import EmptyIcon from "@/components/icons/empty";
import { Button } from "../../components/item-card";
import ProductPicked from "../../components/product-picked";
import PopupPickProduct from "../components/popup-pick-product";
import PopupCreateCustomer from "../../components/popup";
const INIT_DATA = {
  email: "",
  phone_number: "",
  full_name: "",
};
export interface CreateStepMobileProps {
  setStep: (step: any) => void;
  toggleDataProductMobile: () => void;
}

export default function CreateStepMobile(props: CreateStepMobileProps) {
  const { toggleDataProductMobile, setStep } = props;
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const data = context?.values?.data;
  const actions = context?.actions;
  const [openDropdown, setOpenDropdown] = useState(false);
  const [formData, setFormData] = useState<any>(INIT_DATA);
  const [VAT, setVAT] = useState<any>(8);
  const [isCustomerExist, setIsCustomerExist] = useState(false);
  const [account, setAccount] = useState<any[]>([]);
  const [popupCreateCustomer, setPopupCreateCustomer] = React.useState(false);

  const { getCustomer } = apiCustomerService();

  const handleOnchange = (e: any) => {
    const { name, value, checked } = e.target;
    setOpenDropdown(true);
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
      <div className="flex justify-between text-xs p-3">
        <h3 className="text-[#475467]">Danh sách sản phẩm/dịch vụ</h3>
        <button className="text-[#667085] border-none">Xóa tất cả</button>
      </div>
      <div className="bg-white p-3">
        <div
          className="border-solid border border-[var(--text-color-primary)] rounded-lg flex justify-center items-center py-2 text-sm text-[var(--text-color-primary)] gap-2"
          onClick={toggleDataProductMobile}
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm sản phẩm/dịch vụ
        </div>
        <div className="">
          <ProductPicked />
        </div>
      </div>
      <div className="flex flex-col justify-between text-xs ">
        <h3 className="text-[#475467] p-3">Thông tin khách hàng</h3>
        <div className="bg-white p-3">
          <div className="h-fit my-3 flex gap-3 items-center">
            <Button
              name="Khách hàng hệ thống"
              isActive={isCustomerExist}
              onClick={() => setIsCustomerExist((prev) => !prev)}
            />
            <Button
              name="Khách hàng lẻ"
              isActive={!isCustomerExist}
              onClick={() => {
                setIsCustomerExist((prev) => !prev);
                actions && actions.handleChangeOrder("customer", {});
                setFormData(INIT_DATA);
              }}
            />
          </div>
          {isCustomerExist && (
            <div className="mt-3 flex flex-col">
              {/* phone_number */}
              <div className="relative">
                <MyTextField
                  label=""
                  errors={[]}
                  required={[]}
                  configUI={{}}
                  name="phone_number"
                  placeholder="Nhập SĐT"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={{}}
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
                required={[]}
                configUI={{}}
                name="email"
                placeholder="Nhập email KH"
                handleChange={handleOnchange}
                values={formData}
                validate={{}}
                disabled={true}
              />
              {/* full_name */}
              <MyTextField
                label=""
                errors={[]}
                required={[]}
                configUI={{}}
                name="full_name"
                placeholder="Nhập tên KH"
                handleChange={handleOnchange}
                values={formData}
                validate={{}}
                disabled={true}
              />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white">
        <div className=""></div>
      </div>
    </>
  );
}
