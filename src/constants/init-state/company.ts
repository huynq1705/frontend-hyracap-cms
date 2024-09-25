export const INIT_COMPANY = {
    id : 0,
    company_avt :"",
    company_name: "",
    phone_number: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    website: "",
    facebook: "",
    zalo: "",
    short_description: "--",
    business_introduction: "--",
    opening_and_closing_hour: {
        monday: "09:00:00-22:00:00-ACTIVE",
        tuesday: "09:00:00-22:00:00-INACTIVE",
        wednesday: "09:00:00-22:00:00-ACTIVE",
        thursday: "09:00:00-22:00:00-ACTIVE",
        friday: "09:00:00-22:00:00-ACTIVE",
        saturday: "09:00:00-22:00:00-ACTIVE",
        sunday: "09:00:00-22:00:00-ACTIVE"
    }
}

export type InitCompanyKeys = typeof INIT_COMPANY;