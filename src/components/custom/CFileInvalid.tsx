import { HTMLAttributes, memo, useEffect, useState } from "react";
type CVideoProps = HTMLAttributes<HTMLVideoElement | HTMLImageElement> & {
    src: string
}

const CImage = ({
    src,
    ...props
}: CVideoProps): JSX.Element => {
    const [isInvalidVideo, setInvalidVideo] = useState<boolean>(true);

    useEffect(() => {
        setInvalidVideo(true);
    }, [src])

    return (
        <>
            {
                isInvalidVideo ?
                    <img
                        {...props}
                        className="h-[360px]"
                        onError={(e) => {
                            setInvalidVideo(false)
                        }}
                        src={src} />
                    :
                    <video
                        {...props}
                        className="h-[360px] object-cover"
                        muted
                        autoPlay={false}
                        controls
                        controlsList="nodowload noplaybackrate"
                        disablePictureInPicture
                        playsInline
                        itemType="video/mp4"
                        src={src} />
            }
        </>
    )
}

export default memo(CImage);