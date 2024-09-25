import useCustomTranslation from "@/hooks/useCustomTranslation";
import { ImageNotSupportedOutlined } from "@mui/icons-material";
import { memo, useEffect, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import CSkeleton from "./CSkeleton";

type CImageProps = Pick<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'className'>

const CImage = ({
    ...props
}: CImageProps): JSX.Element => {
    const { src } = props;
    const [isLoading, setIsLoading] = useState<boolean | 'error'>(true);
    const { T } = useCustomTranslation();
    const [refImage, setRefImages] = useState<HTMLImageElement | null>(null)
    const isIntersect = useIntersectionObserver(null, refImage);

    useEffect(() => {
        setIsLoading(true);
    }, [src])

    useEffect(() => {
        if (!isIntersect || isLoading) return;
        setIsLoading(false);
        if (!refImage) return;
        refImage.src = src ?? "";
    }, [src, refImage, isLoading, isIntersect])

    useEffect(() => {
        const img = new Image();
        setIsLoading(true);
        img.src = src ?? "";
        img.onload = () => {
            setIsLoading(false)
        }
        img.onerror = () => {
            setIsLoading("error")
        }
    }, [src])

    return (
        <div className="h-full w-full flex justify-center">
            <CSkeleton
                isLoading={isLoading !== 'error' && isLoading}
                className="!h-full w-full !absolute !inset-0"
                isError={isLoading === 'error'}
                errorMessage={
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <ImageNotSupportedOutlined className="!text-gray-6" />
                        <span className="text-gray-5 text-sm text-center">{T("fileNotFound")}</span>
                    </div>
                }>
            </CSkeleton>

            <img
                ref={r => setRefImages(r)}
                className={props.className} />
        </div>
    )
}

export default memo(CImage);