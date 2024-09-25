import { ItemOrder } from "../../types/order";

export const NAME_EMPLOYEE = "Nhân viên thực hiện";
export const NEW_EMPLOYEE_ITEM = {
  name: NAME_EMPLOYEE,
  type: 0,
  commission_percentage: 0,
  commission: 0,
  account_id: 1,
  order_id: 1,
};
export const NEW_ITEM_ORDER: ItemOrder = {
  itemPicked: [],
  payment_methods: [],
  payment: { VAT: 8, sum_order: 0, total: 0, vat: 0 },

  // customer: {
  //   id: 9,
  //   phone_number: "0945711801",
  //   email: "email",
  // },
};
export const INIT_DATA_ORDER: ItemOrder[] = [NEW_ITEM_ORDER, null];
export const DATA_TYPE_ORDER = {
  product: {
    source: [],
    show: [],
  },
  service: {
    source: [],
    show: [],
  },
  prepay: {
    source: [],
    show: [],
  },
  course: {
    source: [],
    show: [],
  },
  employee: { source: [], show: [] },
};
