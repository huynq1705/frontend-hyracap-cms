import { useTranslation } from "react-i18next";

type CustomTranslationResult = {
    t: (str: string, options?: Record<string, string>) => string,
    T: (str: string, options?: Record<string, string>) => string
}
export default function useCustomTranslation(): CustomTranslationResult {
    const { t } = useTranslation();
    const T = (str: string | number, options?: Record<string, string>) => {
        const tranlation = t(`${str}`, options ?? {});
        const result = tranlation.charAt(0).toUpperCase() + tranlation.slice(1);
        return result;
    }
    return {
        t, // normal case
        T  // capitalize
    }
}