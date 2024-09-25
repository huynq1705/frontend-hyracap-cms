import { PaginationQuery } from "@/types/payload.type";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useState } from "react";


export type ResultQueryPagination<T, V> = UseQueryResult<V, unknown> & {
    paginOption: PaginationQuery<T>,
    updatePaginOption: (partialPaginOption: Partial<PaginationQuery<T>>) => void,
}

type CustomQueryOption<T, V> = Omit<UseQueryOptions<V, unknown, V, string | any>, 'queryFn' | 'queryKey'> & {
    queryKey: any[],
    queryFn: (paginOption: PaginationQuery<T>) => Promise<V>,
    defaultPagination: PaginationQuery<T>
}

export default function useQueryPagination<T = any, V = any>(queryOptions: CustomQueryOption<T, V>): ResultQueryPagination<T, V> {
    const { defaultPagination } = queryOptions;
    const [paginOption, setPaginOption] = useState<PaginationQuery<T>>(defaultPagination);

    const updatePaginOption = (partialPaginOption: Partial<PaginationQuery<T>>) => {
        setPaginOption(pre => ({
            ...pre,
            ...partialPaginOption as Required<PaginationQuery<T>>
        }))
    }

    const resultUseQuery = useQuery({
        ..._.omit(queryOptions, 'queryFn', 'queryKey'),
        queryKey: [...queryOptions.queryKey, paginOption],
        queryFn: () => queryOptions.queryFn(paginOption),
    });

    return {
        paginOption,
        updatePaginOption,
        ...resultUseQuery
    }
}