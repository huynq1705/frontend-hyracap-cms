import { memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type NavigateRouteProps = {
    to: string
}
const NavigateRoute = ({ to }: NavigateRouteProps): JSX.Element => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate(to)
    }, [])

    return <></>
}

export default memo(NavigateRoute)
