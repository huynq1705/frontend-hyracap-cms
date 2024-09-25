import { memo } from "react";
import CPortal from "./CPortal";

type CModalProps = {
    visible?: boolean,
    onClose?: () => void,
    children?: React.ReactNode,
}
const CModal = ({
    visible,
    onClose,
    children,
}: CModalProps): JSX.Element => {

    return (
        <>
            {
                visible && 
                <CPortal>
                    <div 
                        onClick={onClose}
                        className="fixed w-screen h-screen z-[1200] inset-0">
                        {children}
                    </div>
                </CPortal>
            }
        </>
    )
}

export default memo(CModal)