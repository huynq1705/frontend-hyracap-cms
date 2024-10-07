import { TITLE_PAGE } from "@/constants";
import { ValidationResult } from "@/types/types";
import dayjs, { Dayjs } from "dayjs";
export function getCurrentMonthStartAndEnd(start?: Dayjs, end?: Dayjs) {
    const now = dayjs();
    const startOfMonth = start ? start.startOf("month") : now.startOf("month");
    const endOfMonth = end ? end.endOf("month") : now.endOf("month");
    const formatDate = (date: Dayjs): string => date.format("YYYY-MM");
    return {
        start: formatDate(startOfMonth),
        end: formatDate(endOfMonth),
    };
}
export const getKeyPage = (
    pathname: string,
    key?: keyof (typeof TITLE_PAGE)[0],
    get_key_obj?: keyof (typeof TITLE_PAGE)[0]
) => {
    let key_result: keyof (typeof TITLE_PAGE)[0] = "key_title";
    if (key) key_result = key;
    const item_find = TITLE_PAGE.find((item) =>
        pathname.includes(item.pathname)
    );
    if (!item_find) return "";
    return item_find[get_key_obj ?? key_result];
};

export function validateRequiredKeys(
    obj: { [key: string]: any },
    requiredKeys: string[]
): ValidationResult {
    const phoneRegex =
        /^(?:\+84|0)(3[2-9]|5[6|8-9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
    const missingKeys: string[] = requiredKeys.filter((key) => {
        if (key === "email") return !emailRegex.test(obj[key]);
        if (key === "phone_number") return !phoneRegex.test(obj[key]);
        // if (key === "link_video") return !urlRegex.test(obj[key]);
        return (
            !obj.hasOwnProperty(key) ||
            obj[key] === undefined ||
            obj[key] === null ||
            !obj[key]
        );
    });
    // console.log("missingKeys ==>", missingKeys);
    return {
        isValid: missingKeys.length === 0,
        missingKeys,
    };
}
export const formatCurrency = (number: number) => {
    return number?.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    });
};

export const formatCurrencyNoUnit = (number: number) => {
    return number?.toLocaleString("vi-VN");
};

export const formatCurrencyToNumber = (currency: string) => {
    const number = parseInt(currency.replace(/[^\d]/g, ""), 10);
    return number | 0;
};
export const getFormattedMonthFromNumber = (monthNumber: number): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = monthNumber.toString().padStart(2, "0"); // Thêm số 0 nếu tháng nhỏ hơn 10
    return `${year}-${month}-01`;
};
export const convertStringToArray = (inputString: string): string[] => {
    return inputString.split(","); // Tách chuỗi và chuyển từng phần tử thành số
};

export const addAdminPrefix = (routes: any) => {
    return routes.map((route: any) => {
        if (route?.isPagePublic) return route;
        const newRoute = {
            ...route,
            path: route.path.startsWith("/")
                ? `/admin${route.path}`
                : `admin/${route.path}`,
        };

        if (route.children) {
            newRoute.children = addAdminPrefix(route.children);
        }

        return newRoute;
    });
};
interface MyObject {
    quantity: number;
    [ke: string]: any;
    // Các key khác của object (nếu có)
}

export function cloneAndAddObjects(arr: MyObject[]): MyObject[] {
    const result: MyObject[] = [];

    arr.forEach((obj) => {
        result.push(obj); // Thêm object gốc vào mảng kết quả
        for (let i = 0; i < obj.quantity - 1; i++) {
            // Tạo bản sao của object và thêm vào mảng kết quả
            const clone = { ...obj };
            clone.quantity = 1; // Đặt quantity của bản sao về 1
            result.push(clone);
        }
    });

    return result;
}
