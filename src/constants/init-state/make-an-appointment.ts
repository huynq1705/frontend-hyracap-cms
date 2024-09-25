export const INIT_MAKE_AN_APPOINTMENT = {
  full_name: "",
  phone_number: "",
  email: "",
  date_time: "",
  range_time: "",
  employee_id: [],
  service_id: [],
  customer_source_id: [],
  category_service_id: [],
  staff_id: [],
  note: "",
  type: 0,
  status: 0,
  platform: 0, // 0 - online, 1 - offline
};
export type InitMakeAnAppointmentKeys = typeof INIT_MAKE_AN_APPOINTMENT;
