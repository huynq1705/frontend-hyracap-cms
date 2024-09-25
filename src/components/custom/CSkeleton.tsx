import useCustomTranslation from "@/hooks/useCustomTranslation"
import { ReplayRounded } from "@mui/icons-material"
import { Button, Skeleton, SkeletonProps } from "@mui/material"
import { memo } from "react"

type CSkeletonProps = SkeletonProps & {
    isLoading: boolean,
    children?: React.ReactNode,
    isError?: boolean,
    refetch?: () => void,
    errorMessage?: React.ReactNode,
}

const CSkeleton = ({
    isLoading,
    children,
    isError = false,
    refetch,
    errorMessage,
    ...props
}: CSkeletonProps): JSX.Element => {
    const {T} = useCustomTranslation();

    const renderError = () => {
        return (
            <div className="text-gray-6 text-sm text-center">
                {T('thereWasError')}
            </div>
        )
    }

    const handleRetry = () => {
        refetch && refetch();
    }

    return (
        <>
            {
                isLoading ? 
                <Skeleton 
                    variant="rounded"
                    animation="wave"
                    {...props} >
                    {children}
                </Skeleton>
                :
                !isError ? 
                    children
                    :
                    <div className="border border-gray-3 rounded-md relative bg-gray-1/50 w-[inherit] h-full">
                        <div className="invisible">{children}</div>
                        <div className="absolute inset-0 flex flex-col space-y-2 items-center justify-center">
                            {errorMessage ?? renderError()}
                            {
                                refetch && 
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    className="flex items-center !rounded-full"
                                    onClick={handleRetry}>
                                    <ReplayRounded fontSize="small"/>
                                    {T('retry')}
                                </Button>
                            }
                        </div>
                    </div>
            }
        </>
    )
}

export default memo(CSkeleton);