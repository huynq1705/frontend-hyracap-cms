import { memo } from "react"
import { Link, LinkProps } from "react-router-dom"

type CustomLinkProp = LinkProps & {
    disabled?: boolean,
}

const CustomLink = ({
    disabled,
    ...props
}: CustomLinkProp): JSX.Element => {

    return (
        <>
            {
                disabled ? 
                <>{props.children}</> 
                :
                <Link {...props}></Link>
            }
        </>
    )
}

export default memo(CustomLink);