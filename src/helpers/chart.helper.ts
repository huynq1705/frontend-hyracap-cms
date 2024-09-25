import { TimeseriesStatistic } from "@/types/response.type";
import ThemeHelper from "@/utils/theme-helper";
import dayjs from "dayjs";
import { EChartsOption } from "echarts";

export default class ChartHelper {

    static parseStackbarReportTimeseries<T extends string>(data: TimeseriesStatistic<T>[] | undefined, T: (str: string) => string, total_label:string) {
        if (!data || !data.length) return {};
        const colorIndex = '7';
        const series = Object.keys(data[0]).filter(v => !['date', 'total_requests'].includes(v)) as T[];
        // data.forEach(d => series.forEach(s => d[s] += Math.floor(Math.random() * 20)));
        const result: EChartsOption = {
            xAxis: [
                {
                    type: 'category',
                    data: data.map(v => dayjs(v.date).isValid() ? dayjs(v.date).format('DD/MM/YYYY') : v.date),
                    axisLabel: {
                        show: true,
                        interval: data.length > 10 ? (i, _) => (i + 1) % Math.floor(data.length / 10) === 0 || i === data.length - 1 : "auto",
                        // rotate: data.length > 10 ? 0 : 0,
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                },

            ],
            legend: {
                bottom: 0,
                itemGap: 20,
                selectedMode: undefined,
                textStyle: {
                    fontFamily: "Exo",
                    fontWeight: 700,
                },
            },
            tooltip: {
                trigger: 'axis',
                className: "!font-[Exo]",
                axisPointer: {
                    // type: 'cross'
                }
            },
            series: [
                {
                    name: T(total_label),
                    type: 'line',
                    yAxisIndex: 0,
                    data: data.map(v => series.reduce((p, c) => p + v[c], 0)),
                },
                ...series.reduce<any[]>((p, c) => {
                    p.push({
                        type: 'bar',
                        // stack: 'total_stack',
                        name: T(c),
                        emphasis: {
                            focus: 'series',
                        },
                        data: data.map(v => v[c])
                    })
                    return p;
                }, []),
            ],
            color: [
                ThemeHelper.palette.info[colorIndex],
                ThemeHelper.palette.success[colorIndex],
                ThemeHelper.palette.warning[colorIndex],
                ThemeHelper.palette.danger[colorIndex],
            ]
        };
        return result;
    }
}