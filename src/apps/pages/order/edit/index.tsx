import React, { useEffect, useState, createContext } from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";
import styles from "@/assets/styles/create-order.module.scss";
import apiProductService from "@/api/apiProduct.service";
import { handleSearchOnFE } from "@/utils/filter";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import apiPrepaidCardFaceValueService from "@/api/apiPrepaidCardFaceValue.service";
import apiTreatmentCardService from "@/api/apiTreamentCard.service";
import apiAccountService from "@/api/Account.service";
import { DataTypeOrder, ItemOrder, TypeDataItemOrder } from "@/types/order";
import {
  DATA_TYPE_ORDER,
  INIT_DATA_ORDER,
  NEW_EMPLOYEE_ITEM,
  NEW_ITEM_ORDER,
} from "@/constants/init-state/order";
import apiOrderService from "@/api/apiOrder.service";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import PopupToastOrder from "@/components/popup/toast-order";
import PopupInvoiceOrder from "@/components/popup/invoice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import { typeProduct } from "@/utils/order";
import { setNavOpen } from "@/redux/slices/navigation.slice";
import HeaderEditOrderPage from "../components/header";
import CreateStep from "../create";
import PaymentStep from "../payment";
import { v4 as uuidv4 } from "uuid";
import { selectOrderSchedule } from "@/redux/selectors/dataOrderSchedule.selector";
import clsx from "clsx";
import MobileEdit from "../mobile/edit";

// Xác định kiểu dữ liệu cho context
interface OrderContextType {
  actions: {
    handleOnPicInfoEmployee: (
      ids: string[],
      commission: number,
      commission_percentage: number,
      uid: string,
    ) => void;
    handleChangeOrder: (key: string, value: any) => void;
    setItemPicked: (
      item_target: {
        id: string;
        type: TypeDataItemOrder;
        [x: string]: any;
      },
      action: "update" | "delete" | "create",
      quantity?: number,
    ) => void;
    handleSearch: (keySearch: string, type: keyof DataTypeOrder) => void;
    setStep: React.Dispatch<React.SetStateAction<"create" | "payment">>;
    handleSetPopups: (key: "preview_invoice" | "toast", value: boolean) => void;
    handleCreateOrder: (isPaid: boolean) => Promise<void>;
  };
  values: {
    orderCurrent: ItemOrder;
    data: DataTypeOrder;
    order_id: number;
  };
}

// Tạo Context với giá trị mặc định
export const OrderContext = createContext<OrderContextType | undefined>(
  undefined,
);

export default function EditPage() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataOrderSchedule = useSelector(selectOrderSchedule);
  const { code } = useParams();
  const userInfo = useSelector(selectUserInfo);
  const [order_id, setOrder_id] = useState(0);
  const [orderCurrentIndex, setOrderCurrentIndex] = useState(0);
  const [listOrder, setListOrder] = useState<ItemOrder[]>(INIT_DATA_ORDER);
  const [flagInit, setFlagInit] = useState(false);
  const [flagPayment, setFlagPayment] = useState(false);
  const [data, setData] = useState<DataTypeOrder>(DATA_TYPE_ORDER);
  const orderCurrent = listOrder[orderCurrentIndex];
  const setItemPicked = (
    item_target: { id: string; type: TypeDataItemOrder; [x: string]: any },
    action: "update" | "delete" | "create",
    quantity?: number,
  ) => {
    const new_order = listOrder.map((order, index) => {
      // check item target
      if (index !== orderCurrentIndex || order === null) return order;
      const new_order = { ...order }; // copy new order
      if (action === "create")
        // check action create
        new_order.itemPicked.push({
          ...item_target,
          quantity: 1,
          uid: uuidv4(),
        });
      if (action === "delete")
        // check action delete
        new_order.itemPicked = new_order.itemPicked.filter(
          (it) => !(it.id === item_target.id && it.type === item_target.type),
        );
      new_order.employee = new_order?.employee
        ? new_order.employee.filter((x) => x.uid !== item_target.uid)
        : [];
      if (action === "update") {
        // check action update
        new_order.itemPicked = new_order.itemPicked.map((it) =>
          it.id === item_target.id && it.type === item_target.type
            ? { ...it, quantity: quantity ?? 1 }
            : it,
        );
        new_order.employee =
          new_order.employee && new_order.employee.length
            ? new_order.employee.map((x) =>
                x.uid == item_target?.uid_item
                  ? {
                      ...x,
                      commission: item_target?.commission ?? 0,
                      commission_percentage:
                        item_target?.commission_percentage ?? 0,
                    }
                  : x,
              )
            : [];
      }
      // end check and return new order
      return new_order;
    });

    setListOrder(new_order);
  };
  const [step, setStep] = useState<"create" | "payment">("create");
  const [popups, setPopups] = useState({
    preview_invoice: false,
    toast: false,
  });
  const { detailCommon } = apiCommonService();
  const { getProduct } = apiProductService();
  const { getService } = apiServiceSpaServicerService();
  const { getPrepaidCardFaceValue } = apiPrepaidCardFaceValueService();
  const { getTreatmentCard } = apiTreatmentCardService();
  const { getAccount } = apiAccountService();
  const [statusOrder, setStatusOrder] = useState<
    "unfinished" | "create" | "unpaid" | "paid"
  >("create");
  const changeIndex = (event: React.SyntheticEvent, newValue: number) => {
    const len = listOrder.length;
    if (len - 1 === newValue) {
      const newList = [...listOrder];
      newList.splice(-1, 1, NEW_ITEM_ORDER, null);
      setListOrder(newList);
      return;
    }
    setOrderCurrentIndex(newValue);
  };
  const handleChangeOrderIndex = (index: number) => {
    setOrderCurrentIndex(index);
    setStep("create");
  };
  const setDataCommon = (key: keyof DataTypeOrder, data: any) => {
    setData((prev) => ({ ...prev, [key]: data }));
  };
  const handleGetDataCommon = async (
    fnGetData: any,
    key: keyof DataTypeOrder,
    fnConvertData: any,
    param_input?: any,
  ) => {
    try {
      const param = {
        page: 1,
        take: 999,
      };
      const response = await fnGetData(param_input ?? param);
      if (response) {
        const convert_data = fnConvertData(response.data);
        setDataCommon(key, {
          show: convert_data,
          source: convert_data,
        });
      }
    } catch (e) {
      throw e;
    }
  };
  const handleSearch = (keySearch: string, type: keyof DataTypeOrder) => {
    const source = data[type].source;
    const new_data = handleSearchOnFE(
      (keySearch ?? "").toString(),
      source,
      "name",
    );
    setData((prev) => ({ ...prev, [type]: { ...prev[type], show: new_data } }));
  };
  const initData = () => {
    const fnConvertDataProduct = (array: any[]) => {
      return array
        .filter((x) => x?.stock)
        .map((it) => ({
          value: it?.id.toString() ?? "",
          name: it?.name || "- -",
          original_price: it?.original_price || 1,
          selling_price: it?.selling_price || 1,
          stock: it?.stock || 1,
          commission: it?.commission || 0,
          commission_percentage: (it?.commission_percentage || 0) * 100,
        }));
    };

    handleGetDataCommon(getProduct, "product", fnConvertDataProduct);

    handleGetDataCommon(
      () =>
        getPrepaidCardFaceValue({
          page: 1,
          take: 999,
          filter: "status__eq__1",
        }),
      "prepay",
      (array: any[]) =>
        array.map((it) => ({
          value: it.id.toString(),
          name: it.name,
          original_price: it.price,
          selling_price: it.denominations,
          use_time: it.use_time,
          commission: it?.staff_commission || 0,
          commission_percentage: (it?.staff_commission_percentage || 0) * 100,
        })),
    );
    const fnConvertData = (array: any[]) =>
      array.map((it) => ({
        value: it.id.toString(),
        name: it.name,
        original_price: null,
        selling_price: it.price,
        commission: it?.staff_commission || 0,
        commission_percentage: (it?.staff_commission_percentage || 0) * 100,
      }));
    handleGetDataCommon(
      () =>
        getTreatmentCard({
          page: 1,
          take: 999,
          filter: "status__eq__1",
        }),
      "course",
      fnConvertData,
    );
    handleGetDataCommon(
      () =>
        getService({
          page: 1,
          take: 999,
          filter: "status__eq__1",
        }),
      "service",
      (array: any[]) =>
        array.map((it) => ({
          value: it.id.toString(),
          name: it.name,
          original_price: null,
          selling_price: it.price,
          commission: it?.commission || 0,
          commission_percentage: (it?.commission_percentage || 0) * 100,
        })),
    );
    handleGetDataCommon(getAccount, "employee", (array: any[]) =>
      array.map((it) => ({
        value: it.id.toString(),
        name: `${it.full_name} (id : ${it.id})`,
        label: `${it.full_name} (id : ${it.id})`,
      })),
    );
    setFlagInit(true);
  };
  const handleOnPicInfoEmployee = (
    ids: string[],
    commission: number,
    commission_percentage: number,
    uid: string,
  ) => {
    const new_list_order: ItemOrder[] = listOrder.map((order, index) => {
      if (index !== orderCurrentIndex || order === null) return order;
      const new_order = {
        ...order,
      };
      const item_employee = ids
        .map((id) => {
          if (!id) return null;
          const employee_name = data.employee.source.find(
            (employee) => employee.value === id,
          )?.name;
          return {
            ...NEW_EMPLOYEE_ITEM,
            account_id: +id,
            employee_name,
            commission,
            commission_percentage,
            uid,
          };
        })
        .filter((x) => x);
      if (!new_order.employee) new_order.employee = item_employee;
      const checkExist = new_order?.employee.find((x) => x.uid == uid);
      if (checkExist)
        new_order.employee = new_order.employee.map((x) =>
          x.uid == uid ? item_employee[0] : x,
        );
      if (!checkExist) new_order.employee.push(item_employee[0]);
      new_order.employee = new_order.employee.filter((x) => x);
      return new_order;
    });
    setListOrder(new_list_order);
  };
  const handleChangeOrder = (key: string, value: any) => {
    const new_list_order: ItemOrder[] = listOrder.map((order, index) => {
      if (index !== orderCurrentIndex || order === null) return order;
      const new_order = {
        ...order,
        [key]: value,
      };
      return new_order;
    });

    setListOrder(new_list_order);
  };
  const removeOrder = (index: number) => {
    const new_list_order = listOrder.filter((order, id) => index !== id);
    if (new_list_order.length === 1)
      new_list_order.splice(-1, 1, { itemPicked: [] }, null);
    setListOrder(new_list_order);
    setStep("create");
  };
  const { saveOrder } = apiOrderService();
  const handleCreateOrder = async (isPaid: boolean) => {
    try {
      const payload: any = {
        account: userInfo,
        order: orderCurrent,
      };
      const isPayment = isPaid || !!code;
      if (isPayment) payload.order.paid = orderCurrent?.payment?.total;
      if (!isPayment) {
        //  handle pick one method
        payload.order.paid = 0;
        payload.order.payment_methods.map((x: any) => ({ ...x, paid: 0 }));
      }
      const response = await saveOrder(payload, code ? +code : null);
      const condition = typeof response === "number";
      if (condition) {
        setOrder_id(+condition);
      }
      if (condition && isPayment)
        setPopups((prev) => ({ ...prev, toast: true }));
      if (condition && !isPaid) {
        dispatch(
          setGlobalNoti({
            type: "info",
            message: `Đã lưu đơn hàng ${
              response || ""
            } trạng thái chờ thanh toán`,
          }),
        );
        navigate("/admin/order");
      }
      if (!condition) {
        dispatch(
          setGlobalNoti({
            type: "error",
            message: `Tạo đơn hàng thất bại`,
          }),
        );
      }
    } catch (e) {
      throw e;
    }
  };
  const handleSetPopups = (key: keyof typeof popups, value: boolean) => {
    setPopups((prev) => ({ ...prev, [key]: value }));
  };
  const handleCreateContentInvoice = () => {
    const result: any = {};
    result.listProduct = orderCurrent?.itemPicked
      .map((it) => {
        const data_find = data[it.type].source.find((x) => x.value === it.id);
        if (!data_find) return null;
        return {
          ...data_find,
          type: it.type,
          quantity: it.quantity,
          total: data_find.selling_price * it.quantity,
          price: data_find.selling_price,
        };
      })
      .filter((x) => x);
    result.customer = orderCurrent?.customer;
    result.employee = {
      name: userInfo?.full_name,
    };
    result.code_order = order_id ?? orderCurrentIndex;
    if (orderCurrent?.payment) {
      result.payment = orderCurrent.payment;
      result.payment.method = orderCurrent?.payment_methods
        ?.map((x: any) => x?.name ?? "")
        .join(",");
    }
    return result;
  };
  const closeNavBar = () => {
    dispatch(setNavOpen(false));
  };
  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<any>(code, "/order");
      const new_list_order = listOrder.map((order, index) => {
        const uid = uuidv4();
        if (index || order === null) return order;
        const new_oder: any = {};
        new_oder.employee = [];
        new_oder.itemPicked = response.order_detail.map((product: any) => {
          const values = Object.values(typeProduct);
          const type = values.find(
            (value: any) => value.value === product.type,
          );
          if (product.account_order.length)
            new_oder.employee.push({
              ids: [product.account_order[0].account.id.toString()],
              commission: product.account_order[0].commission,
              commission_percentage:
                product.account_order[0].commission_percentage,
              uid,
              account_id: product.account_order[0].account.id.toString(),
            });
          return {
            id: product[type?.key as string].toString(),
            type: type?.type,
            quantity: product.quantity,
            uid,
          };
        });
        new_oder.payment_methods = response?.payment_methods_detail.map(
          (x: any) => ({
            paid: x?.paid,
            payment_methods_id: x?.payment_methods?.id,
            name: x?.payment_methods.name,
            order_id: code,
            id_card: x.payment_methods.id,
            type: 0,
          }),
        );
        if (response?.customer)
          new_oder.customer = {
            email: response.customer.email,
            phone_number: response.customer.phone_number,
            full_name: response.customer.full_name,
            id: response.customer.id,
          };
        new_oder.payment = {
          total: response.total,
          VAT: response.VAT,
          sum_order: response.provisional,
          vat: (response.provisional * response.VAT) / 100,
        };
        console.log("response", { response, new_oder });

        return new_oder;
      });

      setStep("payment");
      setFlagPayment(response?.paid === response?.total);
      setOrder_id(response.id);

      setListOrder(new_list_order);
      let newStatusOrder: any = "paid";
      if (!response.paid) newStatusOrder = "unfinished";
      if (response.paid != 0 && response.paid < response.total)
        newStatusOrder = "unpaid";
      setStatusOrder(newStatusOrder);
    } catch (e) {
      throw e;
    }
  };
  useEffect(() => {
    !flagInit && initData();
    setListOrder([
      {
        itemPicked: [],
        payment_methods: [],
        payment: { VAT: 8, sum_order: 0, total: 0, vat: 0 },
      },
      null,
    ]);
    closeNavBar();
  }, [pathname]);
  useEffect(() => {
    code && getDetail();
  }, [code]);
  useEffect(() => {
    if (dataOrderSchedule.customer?.id && data.service.source.length) {
      const new_list_order: ItemOrder[] = listOrder.map((x) => {
        const { customer, list_service_id, schedule_id } = dataOrderSchedule;
        if (!x) return x;
        const list_item_picked: any = list_service_id.map((x: any) => {
          const service = data.service.source.find((item) => item.value == x);
          return {
            id: x.toString(),
            name: service?.name ?? "",
            price: service?.price ?? "",
            quantity: 1,
            type: "service",
            uid: uuidv4(),
          };
        });
        const result = {
          itemPicked: list_item_picked,
          customer: {
            email: customer?.email,
            id: customer?.id,
            phone_number: customer?.phone_number,
            full_name: customer?.full_name,
          },
          payment_methods: [],
          payment: {
            VAT: 8,
            sum_order: 0,
            total: 0,
            vat: 0,
          },
          schedule_id,
        };
        result.payment.sum_order = list_item_picked.reduce(
          (sum: any, item: any) =>
            (sum += item?.price ?? 0 * item?.quantity ?? 1),
          0,
        );
        return result;
      });
      setListOrder(new_list_order);
    }
  }, [data]);
  const actions = {
    handleOnPicInfoEmployee,
    handleChangeOrder,
    setItemPicked,
    handleSearch,
    handleCreateOrder,
    handleSetPopups,
    setStep,
  };
  // const values = ;
  const isMobile = window.innerWidth <= 768;
  // console.log("order :", values);
  return (
    <OrderContext.Provider
      value={{
        actions,
        values: {
          orderCurrent,
          data,
          order_id,
        },
      }}
    >
      <div className={clsx(styles.wrapper, isMobile && "!hidden")}>
        <Stack direction={"column"} className="w-full h-full">
          <HeaderEditOrderPage
            changeIndex={changeIndex}
            index={orderCurrentIndex}
            isUpdate={!!code}
            listTabs={listOrder}
            removeItem={removeOrder}
          />
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={orderCurrentIndex}
            onChangeIndex={handleChangeOrderIndex}
            className="flex-grow"
          >
            {listOrder.map((order, index) => (
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={step === "create" ? 0 : 1}
                className={styles.swipeable_views}
              >
                {step === "create" && (
                  <CreateStep
                    index={index}
                    setStep={setStep}
                    statusOrder={statusOrder}
                  />
                )}
                <PaymentStep
                  index={index}
                  flagPayment={flagPayment}
                  statusOrder={statusOrder}
                />
                {/* mobile */}
              </SwipeableViews>
            ))}
          </SwipeableViews>
          {/* ---------- */}
        </Stack>
        {/* --- */}
        <PopupToastOrder
          open={popups.toast}
          order_id={order_id}
          onClose={() => {
            setPopups((prev) => ({ ...prev, toast: false }));
            removeOrder(orderCurrentIndex);
            navigate("/admin/order");
          }}
          onPreviewInvoice={() => {
            setPopups((prev) => ({
              ...prev,
              preview_invoice: true,
              toast: false,
            }));
          }}
        />
        {/* -- */}
        {popups.preview_invoice && (
          <PopupInvoiceOrder
            content={handleCreateContentInvoice()}
            open={popups.preview_invoice}
            onClose={() => {
              setPopups((prev) => ({ ...prev, preview_invoice: false }));
              removeOrder(orderCurrentIndex);
              navigate("/admin/order");
            }}
          />
        )}
      </div>
      {window.innerWidth < 768 && (
        <MobileEdit
          setStep={setStep}
          step={step}
          statusOrder={statusOrder}
          handleCreateContentInvoice={handleCreateContentInvoice}
          removeOrder={() => {
            removeOrder(orderCurrentIndex);
          }}
        />
      )}
    </OrderContext.Provider>
  );
}
