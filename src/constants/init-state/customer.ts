export const INIT_CUSTOMER: { [x: string]: any } = {
  id: 0,
  full_name: "",
  phone_number: "",
  email: "",
  gender: 1,
  address: "",
  note: "",
  date_of_birth: "2000-10-10",
  total_spending: 0,
  customer_source_id: [],
  customer_classification_id: [],
  account_customer: [],
  contact_staff: [],
  person_in_charge: [],
};
export type InitCustomerKeys = typeof INIT_CUSTOMER;
export const GENDER_LIST = [
  {
    title: "",
    options: [
      {
        value: "0",
        name: "Nam",
      },
      {
        value: "1",
        name: "Nữ",
      },
    ],
  },
];
