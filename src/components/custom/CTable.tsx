import useCustomTranslation from "@/hooks/useCustomTranslation";
import { PaginationQuery } from "@/types/payload.type";
import { FindInPageRounded } from "@mui/icons-material";
import {
    List,
    ListItem,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableContainerProps,
    TableHead,
    TableProps,
    TableRow,
    TableSortLabel,
    Typography,
} from "@mui/material";
import clsx from "clsx";
import _ from "lodash";
import React, { memo, useEffect, useState } from "react";
import CCollapsibleRow from "./CCollapsibleRow";
import CPagination from "./CPagination";
import CTableLoading from "./CTableLoading";
import CTableSearchPopover from "./CTableSearchPopover";

type CTableSortType<T> = Pick<PaginationQuery<T>, "direction" | "order_by"> &
    Partial<Pick<PaginationQuery<T>, "page">>;

export type CTableSearchFilterFormData = {
    key: string;
} & (
    | {
          type: "text";
      }
    | {
          type: "checkbox";
          options: {
              label: React.ReactNode;
              value: string;
          }[];
      }
    | {
          type: "radio";
          options: {
              label: React.ReactNode;
              value: string;
          }[];
      }
);
export type CTableSearchFilterForm = {
    icon?: React.ReactNode;
    formData: Array<CTableSearchFilterFormData>;
    onSubmit: (formValues: Record<string, string | number>) => void;
    formValue: Record<string, string | string[]>;
};
export type CTableColumnKey<TableType> = {
    key: keyof TableType | string;
    formatter?: (
        value: keyof TableType,
        rowRecord: TableType
    ) => React.ReactNode;
    onSort?: (opt: CTableSortType<TableType>) => void;
    searchFilterForm?: CTableSearchFilterForm;
};

export type CTableRowActionButton<TableType> = {
    onClick?: (item: TableType) => void;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    title?: React.ReactNode;
};
export type CTableProps<TableType> = {
    title?: React.ReactNode;
    extraTitle?: React.ReactNode;

    columnKeys: Array<CTableColumnKey<TableType>>;
    data?: TableType[];
    sortOption?: CTableSortType<TableType>;
    isLoading?: boolean;
    pagination?: {
        count: number;
        page: number;
        onPageChange: (
            event: React.MouseEvent<HTMLButtonElement> | null,
            newPage: number
        ) => void;
        rowsPerPage: number;
        onRowsPerPageChange: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => void;
    };
    expandedRowRender?: (item: TableType) => React.ReactNode;
    minWidth?: number;
    rowKey?: keyof TableType;
    rowActionButtons?: CTableRowActionButton<TableType>[];
    tableProps?: TableProps;
    responsive?: boolean;
} & TableContainerProps &
    Partial<{
        component: React.ElementType;
    }>;

const CTable = <T extends object = Record<string, string>>({
    title,
    extraTitle,
    columnKeys,
    data,
    sortOption,
    isLoading = false,
    rowActionButtons,
    pagination,
    expandedRowRender,
    minWidth,
    rowKey,
    tableProps,
    responsive = true,
    ...props
}: CTableProps<T>): JSX.Element => {
    const { T } = useCustomTranslation();
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const createSortHandler =
        (
            property: keyof T | string,
            onSort?: (opt: CTableSortType<T>) => void
        ) =>
        (event: React.MouseEvent<unknown>) => {
            if (!sortOption) return;
            const isAsc =
                sortOption.order_by === property &&
                sortOption.direction === "asc";
            onSort &&
                onSort({
                    direction: isAsc ? "desc" : "asc",
                    order_by: property,
                });
        };

    const handleToggleRow = (rowKeyValue: string) => {
        setExpandedRows((pre) => {
            const isKeyExist = pre.includes(rowKeyValue);
            if (isKeyExist) {
                return pre.filter((v) => v !== rowKeyValue);
            } else {
                return [...pre, rowKeyValue];
            }
        });
    };

    useEffect(() => {
        setExpandedRows([]);
    }, [sortOption?.page]);

    return (
        <>
            <div
                className={clsx(
                    !navigator.userAgent.toLowerCase().includes("ubuntu") &&
                        responsive &&
                        "hidden md:block"
                )}
            >
                <TableContainer
                    elevation={2}
                    component={"div"}
                    {...props}
                    className={clsx(
                        "overflow-auto border border-gray-4 rounded",
                        props.className
                    )}
                >
                    {title && (
                        <div className="p-3 flex justify-between items-center flex-wrap">
                            <Typography variant="h6" component="div">
                                {title}
                            </Typography>
                            {extraTitle}
                        </div>
                    )}
                    <Table
                        sx={{ minWidth: minWidth ?? 650 }}
                        {...tableProps}
                        stickyHeader={false}
                    >
                        <TableHead>
                            <TableRow
                                className={clsx(
                                    "bg-gray-2",
                                    tableProps?.stickyHeader &&
                                        "!sticky !w-full !z-[9999] !inset-0 p-"
                                )}
                            >
                                {columnKeys.map((colkey) => (
                                    <TableCell
                                        sortDirection={
                                            sortOption?.order_by === colkey.key
                                                ? sortOption?.direction
                                                : false
                                        }
                                        key={String(colkey.key)}
                                    >
                                        <div className="flex justify-between w-full items-center">
                                            <TableSortLabel
                                                className="!bg-gray-2 !font-bold !text-gray-8"
                                                active={
                                                    sortOption?.order_by ===
                                                    colkey.key
                                                }
                                                disabled={
                                                    !sortOption ||
                                                    !Boolean(colkey.onSort)
                                                }
                                                direction={
                                                    sortOption?.order_by ===
                                                    colkey.key
                                                        ? sortOption?.direction
                                                        : "asc"
                                                }
                                                onClick={createSortHandler(
                                                    colkey.key,
                                                    colkey.onSort
                                                )}
                                            >
                                                {T(String(colkey.key))}
                                            </TableSortLabel>
                                            {colkey.searchFilterForm && (
                                                <CTableSearchPopover
                                                    {...colkey.searchFilterForm}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        {!isLoading ? (
                            data?.length ? (
                                <TableBody>
                                    {data?.map((item, i) => (
                                        <CCollapsibleRow
                                            key={i}
                                            item={item}
                                            columnKeys={columnKeys}
                                            expandedRowRender={
                                                expandedRowRender
                                            }
                                            rowActionButtons={rowActionButtons}
                                            onExpandToggle={() =>
                                                expandedRowRender &&
                                                handleToggleRow(
                                                    rowKey
                                                        ? `${item[rowKey]}`
                                                        : `${i}`
                                                )
                                            }
                                            isOpen={expandedRows.includes(
                                                rowKey
                                                    ? `${item[rowKey]}`
                                                    : `${i}`
                                            )}
                                        />
                                    ))}
                                </TableBody>
                            ) : (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={columnKeys.length}>
                                            <div className="flex justify-center items-center flex-col space-y-1 select-none animate-fadeup">
                                                <FindInPageRounded className="!text-gray-6 !text-5xl" />
                                                <div> {T("noResultFound")}</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )
                        ) : (
                            <CTableLoading colCount={columnKeys.length} />
                        )}
                    </Table>
                    {pagination && <CPagination {...pagination} />}
                </TableContainer>
            </div>

            {/* responsive table */}
            <div
                className={clsx(
                    "md:hidden flex flex-col space-y-4 pr-2",
                    props.className,
                    !responsive && "!hidden"
                )}
            >
                {title && (
                    <div className="p-3 flex justify-between items-center flex-wrap">
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                        {extraTitle}
                    </div>
                )}
                {data?.map((item, i) => (
                    <List
                        dense
                        key={i}
                        className="border border-gray-4 shadow rounded"
                    >
                        {columnKeys.map((colKey) => (
                            <ListItem
                                key={String(colKey.key)}
                                className="border-b border-gray-4 last:border-none animate-fadeup even:bg-gray-1"
                            >
                                <ListItemText
                                    primary={
                                        <span className="font-medium text-gray-9">
                                            {T(String(colKey.key))}
                                        </span>
                                    }
                                    secondary={
                                        colKey.formatter
                                            ? colKey.formatter(
                                                  _.get(
                                                      item,
                                                      String(colKey.key)
                                                  ),
                                                  item
                                              ) || "-"
                                            : _.get(item, String(colKey.key)) ||
                                              "-"
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ))}
            </div>
        </>
    );
};
const genericMemo: <T>(c: T) => T = memo;
export default genericMemo(CTable);
