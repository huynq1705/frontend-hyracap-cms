import * as React from "react";
import styles from "@/assets/styles/create-order.module.scss";
import { useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import apiPaymentMethodsService from "@/api/apiPaymentMethods.service";
import { Box } from "@mui/material";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import { removeVietnameseTones } from "@/utils/remove-vietnamese";
import { OrderContext } from "../../edit";

export default function DataMethod() {
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const order_id = context?.values?.order_id;
  const actions = context?.actions;
  const dispatch = useDispatch();
  const [paymentMethods, setPaymentMethods] = React.useState<any[]>([]);
  const { getPaymentMethods } = apiPaymentMethodsService();
  const getAllPaymentMethods = async () => {
    try {
      const param = {
        page: 1,
        take: 999,
        filter: "status__eq__1",
      };
      const response = await getPaymentMethods(param);
      if (response && Array.isArray(response.data)) {
        setPaymentMethods(response.data);
      }
    } catch (e) {
      throw e;
    }
  };
  React.useEffect(() => {
    getAllPaymentMethods();
  }, []);
  return (
    <div className="flex flex-col gap-2 mt-3">
      {paymentMethods.map((payment) => {
        let checkActive = !orderCurrent?.payment_methods?.find(
          (x: any) => x.id == payment.id,
        );
        const name_convert = removeVietnameseTones(
          payment.name,
        ).toLocaleLowerCase();
        const check_customer =
          ["tra truoc", "lieu trinh"].find((x) => name_convert.includes(x)) &&
          !orderCurrent?.customer?.id;
        const check_debt =
          ["lieu trinh"].find((x) => name_convert.includes(x)) &&
          order_id &&
          orderCurrent?.payment_methods?.length;
        const check_exist_treatment_method =
          removeVietnameseTones(payment.name)
            .toLowerCase()
            .includes("lieu trinh") &&
          orderCurrent?.payment_methods?.find((x) =>
            removeVietnameseTones(x.name).toLowerCase().includes("lieu trinh"),
          );
        const check_exist_service =
          removeVietnameseTones(payment.name)
            .toLowerCase()
            .includes("lieu trinh") &&
          !orderCurrent?.itemPicked.find((x) => x.type == "service");
        if (
          check_customer ||
          check_exist_treatment_method ||
          check_exist_service ||
          check_debt
        ) {
          checkActive = false;
        }

        return (
          <Box
            key={payment.id}
            className={clsx(
              "w-full py-3 px-4 flex items-center gap-3 rounded-md cursor-pointer flex-wrap justify-between  hover:bg-[var(--bg-color-primary)] ",
              orderCurrent?.payment_methods?.find((x) => x.id === payment.id) &&
                "text-[var(--text-color-primary)]",
              payment.name.toLowerCase().includes("qr") &&
                orderCurrent?.payment_methods?.find(
                  (x) => x.id === payment.id,
                ) &&
                "bg-[#F6FAF7]",
              !checkActive && "!bg-[#ccc] !opacity-70",
              checkActive && "hover:text-[var(--text-color-primary)]",
            )}
            onClick={() => {
              if (!checkActive) {
                dispatch(
                  setGlobalNoti({
                    type: "info",
                    message: "Không thể chọn phương thức này",
                  }),
                );
                return;
              }
              orderCurrent?.payment_methods &&
                actions &&
                actions.handleChangeOrder("payment_methods", [
                  ...(orderCurrent?.payment_methods ?? []),
                  {
                    ...payment,
                    id: payment.id,
                    name: payment.name,
                    paid: 0,
                  },
                ]);
            }}
            sx={{
              border: "1px solid #D0D5DD",
              "&:hover": {
                borderColor: checkActive
                  ? "var(--text-color-primary)"
                  : "#D0D5DD",
              },
            }}
          >
            <b className="text-base font-semibold">{payment.name}</b>

            <div className="">
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </Box>
        );
      })}
    </div>
  );
}
