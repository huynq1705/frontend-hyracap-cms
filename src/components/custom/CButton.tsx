import { Button, ButtonProps, CircularProgress } from "@mui/material"
import { memo } from "react"

type CButtonProps = ButtonProps & {
    isLoading?: boolean,
}
const CButton = ({
    isLoading,
    ...props
}: CButtonProps): JSX.Element => {

    return (
        <div className="relative flex justify-center h-fit w-fit">
            <Button {...props}/>
            {
                isLoading &&
                <CircularProgress
                    size={24}
                    className="text-primary"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            }
        </div>
    )
}

export default memo(CButton);