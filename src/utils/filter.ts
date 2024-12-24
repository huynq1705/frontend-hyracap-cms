import { KeySearchType } from "@/types/types";
import { removeVietnameseTones } from "./remove-vietnamese";

export const convertObjToParam = (
    obj: KeySearchType,
    page_obj: { [key: string]: any }
) => {
    let url = "?";
    let filter = "&"; //bỏ filter=
    delete obj["take"];
    delete obj["page"];
    delete obj["text"];
    delete obj["filterStr"];
    url += `page=${page_obj.page}`;
    url += `&take=${page_obj.take}`;
    Object.keys(page_obj).forEach((key) => {
        if (page_obj[key]) {
            url += `&${key}=${page_obj[key]}`;
        }
    });
    const keys = Object.keys(obj);
    console.log("keys", keys);
    if (keys.length === 0) return url;
    filter = keys
        .filter((x) => !!obj[x])
        .reduce((result, key, index) => {
            if (obj[key] === "") return result;
            index
                ? (result += `,${key}__${obj[key]}`)
                : (result += `${key}__${obj[key]}`);
            return result;
        }, filter);
    return url + filter;
};
interface parseQueryParamsInput {
    page: string;
    take: string;
    filter: string;
    text?: string;
}
export const parseQueryParams = (input: parseQueryParamsInput) => {
    const { filter, page, take, text } = input;
    const result: { [key: string]: string | number } = { page, take };
    if (filter) {
        filter.split(",").forEach((pair) => {
            const [key, subfix, value] = pair.split("__");
            if (key && value) {
                result[key + "__" + subfix] = value;
            }
        });
    }
    if (text) result["text"] = text;

    return result;
};

export function handleSearchOnFE(
    key_search: string,
    data_search: any[],
    name: string
) {
    console.log("fnc filter", { key_search, data_search, name });
    return data_search.filter((data) => {
        console.log("==>", removeVietnameseTones(data[name].toLowerCase()));
        return removeVietnameseTones(data[name].toLowerCase()).includes(
            removeVietnameseTones(key_search.toLowerCase())
        );
    });
}

export const handleGetParam = (
    searchParams: URLSearchParams,
    filter?: string
) => {
    const params: any = {};

    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    if (!params["page"]) params["page"] = 1;
    if (!params["take"]) params["take"] = 10;
    if (!params["filter"]) params["filter"] = filter;
    console.log("params", params);
    console.log("filter", filter);
    return params;
};

export const handleGetPage = (searchParams: URLSearchParams) => {
    // Lấy giá trị page và take từ searchParams
    const current_age = searchParams.get("page");
    const page_size = searchParams.get("take");
    let obj = {
        page: current_age || "1",
        take: page_size || "10",
        filter: searchParams.get("filter") || "",
        text: searchParams.get("text") || "",
    };

    const objFromParams = Object.fromEntries([...searchParams]);

    obj = { ...obj, ...objFromParams };

    const new_key_search = parseQueryParams(obj);

    return {
        currentPage: current_age ? +current_age : 1,
        pageSize: page_size ? +page_size : 10,
        key_search: new_key_search,
    };
};

interface parseQueryParamsNoFilter {
    filter: string;
    text?: string;
}

export const parseQueryParamsNoFilter = (input: parseQueryParamsNoFilter) => {
    const { filter, text } = input;
    const result: { [key: string]: string | number } = {};
    if (filter) {
        filter.split(",").forEach((pair) => {
            const [key, subfix, value] = pair.split("__");
            if (key && value) {
                result[key] = value;
            }
        });
    }
    if (text) result["text"] = text;

    return result;
};

export const handleGetKetDown = (searchParams: URLSearchParams) => {
    // Lấy giá trị page và take từ searchParams
    let obj = {
        filter: searchParams.get("filter") || "",
        text: searchParams.get("text") || "",
    };

    const objFromParams = Object.fromEntries([...searchParams]);

    obj = { ...obj, ...objFromParams };

    const new_key_search = parseQueryParamsNoFilter(obj);

    return {
        key_search: new_key_search,
    };
};
