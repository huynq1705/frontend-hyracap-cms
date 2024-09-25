import useCustomTranslation from "@/hooks/useCustomTranslation"
import { memo } from "react"
import { Link } from "react-router-dom"

type BreadCrumbLinkProps = {
    linkTo: string,
    component?: 'link' | 'span',
    label?: string,
}

const BreadCrumbLink = ({
    linkTo,
    component = 'link',
    label
}: BreadCrumbLinkProps): JSX.Element => {
    const {T} = useCustomTranslation();

    return (
        <>
            {
                component === 'link' ? 
                <Link to={`/${linkTo}`}>
                    {T(label || linkTo)}
                </Link>
                :
                <span>{T(label || linkTo)}</span>
            }
        </>
    )
}

export default memo(BreadCrumbLink)