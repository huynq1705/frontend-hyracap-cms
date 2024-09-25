export const REPORT_REVENUE: { [x: string]: any } = {
  start_date: new Date(new Date()).toISOString().split('T')[0],
  end_date: new Date(new Date()).toISOString().split('T')[0],
  month: new Date(new Date()).toISOString().split('T')[0],
  person_in_charge: [],
  contact_staff: [],
  customer_source: [],
  payment_method: [],
  service_catalog: [],
  evaluation_criteria: [],
  reviews: [],
  // customer_classification_id: [],
  // account_customer: [],
  // contact_staff: [],
  // person_in_charge: [],
};
export type InitCustomerKeys = typeof REPORT_REVENUE;
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
