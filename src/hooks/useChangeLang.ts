import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectLang } from "@/redux/selectors/app.selector";
import { Lang } from "@/types/types";
import { setLang } from "@/redux/slices/app.slice";
import { useTranslation } from "react-i18next";


export default function useChangeLang() {
    const lang = useSelector(selectLang);
    const { i18n } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        const locale = localStorage.getItem('lang') ?? 'vi';
        dispatch(setLang(locale as Lang));
    }, [dispatch])

    useEffect(() => {
        i18n.changeLanguage(lang)
    }, [i18n, lang])
}