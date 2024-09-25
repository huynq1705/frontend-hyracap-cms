import { useEffect, useState } from "react";

export default function useIntersectionObserver(
    root: HTMLElement | null,
    target: HTMLElement | null,
) {
    const [isIntersect, setIsIntersect] = useState<boolean>(false);

    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const isIntersectingOnce = entries.every(entry => entry.isIntersecting);
        if (!isIntersectingOnce) return;
        setIsIntersect(true);
        target && observer.unobserve(target);
        observer.disconnect();
    };

    useEffect(() => {
        if (!target) return;

        const observer = new IntersectionObserver(callback, {
            root,
            rootMargin: "0px",
            threshold: 1.0,
        });
        observer.observe(target);

        return () => {
            observer.unobserve(target);
            observer.disconnect();
        }
    }, [target, root])

    return isIntersect;
}