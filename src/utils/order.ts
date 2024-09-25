import { PayloadOrder } from "@/types/order";

interface Input {
  account: any;
  order: any;
}

export const typeProduct = {
  product: {
    type: "product",
    key: "product_id",
    value: 3,
  },
  service: {
    type: "service",
    key: "service_id",
    value: 2,
  },
  prepay: {
    type: "prepay",
    key: "prepaid_card_face_value_id",
    value: 0,
  },
  course: {
    type: "course",
    key: "treatment_id",
    value: 1,
  },
};

export function transformDataOrder(
  input: Input,
  id: number | null,
): PayloadOrder {
  const order_id = id ?? 0;
  const { account, order } = input;
  const {
    payment,
    itemPicked,
    payment_methods,
    customer,
    paid,
    employee,
    schedule_id,
  } = order;

  return {
    schedule_id,
    provisional: payment?.sum_order ?? 0,
    VAT: +payment?.VAT ?? 0,
    total: payment?.total ?? 0,
    paid: paid ?? 0,
    note: order.note ?? "",
    status: null, // assuming this field needs to be set as 0
    payment_methods_detail: payment_methods
      ? payment_methods.map((it: any) => ({
          paid: it?.paid ?? 0,
          payment_methods_id: it?.payment_methods_id ?? it?.id,
          order_id,
          order_detail_information_id: it?.order_detail_information_id ?? null,
          list_service_id: it?.list_service_id ?? null,
          total_treatment: it?.total_treatment ?? null,
          type: it.type ?? 1,
        }))
      : [],
    creator_id: account?.id ?? null,
    customer_id: customer?.id ?? null,
    order_detail: itemPicked.map((item: any) => {
      const { key, value } = typeProduct[item.type as keyof typeof typeProduct];
      const quantity = item?.quantity ?? 1;
      const convert_item: any = {
        name: item.name ?? null,
        quantity,
        price: item?.price ?? 0,
        type: value,
        amount: quantity * (item?.price ?? 0), // Calculated amount
        number_of_treatment_used: item.number_of_treatment_used ?? 0,
        number_of_remaining_treatments:
          item.number_of_remaining_treatments ?? 0,
        remaining_amount_of_prepaid_card:
          item.remaining_amount_of_prepaid_card ?? 0,
        amount_used: item.amount_used ?? 0,
        use_time: item.use_time ?? 0,
        expiration_date: item.expiration_date ?? "",
        order_id,
        prepaid_card_face_value_id:
          key === "prepaid_card_face_value_id" ? +item.id : null,
        treatment_id: key === "treatment_id" ? +item.id : null,
        product_id: key === "product_id" ? +item.id : null,
        service_id: key === "service_id" ? +item.id : null,
        account_order: employee
          ? employee
              .filter((x: any) => x.uid === item.uid)
              .map((x: any) => ({
                name: "Nhân viên thực hiện",
                type: 0,
                commission_percentage: x?.commission_percentage ?? 0,
                commission: x?.commission ?? 0 * quantity,
                account_id: x?.account_id ?? null,
                order_detail_id: 0, // adjust according to your logic
              }))
          : [],
      };

      return convert_item;
    }),
  };
}
