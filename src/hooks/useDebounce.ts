import { useEffect, useRef } from "react";

type ResultDebounce = (fn: Function) => void

export default function useDebounce(timeout: number = 250): ResultDebounce {
    const timerRef = useRef<number>();

    useEffect(() => {
        return () => {
            timerRef.current && window.clearTimeout(timerRef.current);
        }
    }, [])

    const debounce = (fn: Function) => {
        timerRef.current && window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            fn();
        }, timeout)
    }

    return debounce;
}