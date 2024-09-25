import { memo } from "react";
import { createPortal } from 'react-dom';
type CPortalProps = {
    children?: React.ReactNode,
}
const CPortal = ({
    children
}: CPortalProps): JSX.Element => {

    return (
        <div className="animate-zoomOut">
            {  
                createPortal(children, document.body)
            }
        </div>
    )
}

export default memo(CPortal)