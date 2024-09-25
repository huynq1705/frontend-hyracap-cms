import { memo } from "react"
import ReactJson from 'react-json-view'

type CJsonViewerProps = {
    value?: any
}
const CJsonViewer = ({
    value
}: CJsonViewerProps): JSX.Element => {

    return (
        <div className="w-full h-full relative">
            <div className="absolute inset-0 overflow-auto">
                <ReactJson
                    src={value || {}}
                    theme="rjv-default"
                    enableClipboard={false}
                    onEdit={false}
                    onAdd={false}
                    onDelete={false}
                    displayDataTypes={false}
                    displayObjectSize
                    collapsed={false}
                    name={null}
                    />
            </div>
        </div>
    )
}

export default memo(CJsonViewer)