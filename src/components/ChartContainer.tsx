
import useCustomTranslation from '@/hooks/useCustomTranslation';
import chartPalette from '@/theme/chart-palette';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';
import { memo } from 'react';
import CSkeleton from './custom/CSkeleton';

const MIN_HEIGHT = 350;
type ChartContainerProp = {
    option: EChartsOption,
    isLoading?: boolean,
    height?: number,
    isError?: boolean,
    refetch?: () => void,
}

const ChartContainer = ({
    option,
    isLoading = false,
    height = MIN_HEIGHT,
    isError,
    refetch
}: ChartContainerProp) => {
    const {T} = useCustomTranslation();

    return (
        <div className="animate-fadeup relative w-full h-full overflow-hidden">
            <CSkeleton isLoading={isLoading} isError={isError} refetch={refetch} className="!max-w-none !w-full">
                <ReactECharts
                    className="!w-full"
                    style={{
                        height: `${height}px`,
                        minHeight: `${MIN_HEIGHT}px`,
                    }}
                    option={{
                        color: chartPalette,
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            bottom: 15,
                        },
                        grid: {
                            left: 30,
                            right: 30,
                            bottom: 60,
                            containLabel: true,
                        },
                        ...option
                    }}
                    notMerge
                    lazyUpdate
                    theme={"theme_name"}
                />
            </CSkeleton>
        </div>
    )
}
export default memo(ChartContainer);