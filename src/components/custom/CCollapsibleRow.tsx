import { Button, Collapse, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import clsx from "clsx";
import _ from "lodash";
import { memo, useEffect, useRef } from "react";
import { CTableProps } from "./CTable";

type CCollapsibleRowProps<T> = {
    item: T,
    columnKeys: CTableProps<T>['columnKeys'],
    expandedRowRender?: CTableProps<T>['expandedRowRender'],
    rowActionButtons?: CTableProps<T>['rowActionButtons'],
    onExpandToggle?: () => void,
    isOpen?: boolean,
}

const CCollapsibleRow = <T extends object = Record<string, string>,>({
    item,
    columnKeys,
    expandedRowRender,
    rowActionButtons,
    onExpandToggle,
    isOpen,
}: CCollapsibleRowProps<T>): JSX.Element => {
    const ref = useRef<HTMLTableRowElement | null>(null)

    const toggleCollapseOpen = () => {
        onExpandToggle && onExpandToggle();
    }

    useEffect(() => {
        if(!isOpen) return;
        // window.setTimeout(() => {
        //     ref.current?.scrollIntoView({block: 'start', behavior: "smooth"})
        // },100)
    }, [isOpen])
    
    
    return (
        <>
            <TableRow
                ref={ref}
                onClick={toggleCollapseOpen}
                sx={{ "& > *": { borderBottom: "unset"} }}
                className={clsx("animate-fadeup relative group cursor-pointer group", expandedRowRender ? "[&:nth-child(4n-1)]:bg-gray-1" : "even:bg-gray-1")}>
                {
                    columnKeys.map(colKey => 
                        <TableCell key={String(colKey.key)} className="!text-gray-10">
                            <span style={{wordBreak: 'break-word'}}>
                                {
                                    colKey.formatter ? 
                                        colKey.formatter(_.get(item, String(colKey.key)), item) || '-': 
                                        _.get(item, String(colKey.key)) || '-'
                                }
                            </span>
                        </TableCell>
                    )
                }
                <div className={clsx("absolute group-hover:visible invisible right-0 top-0 bottom-0 flex space-x-1 justify-center items-center", !rowActionButtons && 'hidden')}>
                    {
                        rowActionButtons?.map((btn, i) => 
                            <Tooltip 
                                key={i} 
                                title={btn.title} 
                                disableInteractive>
                                {
                                    btn.label ? 
                                    <Button
                                        startIcon={btn.icon}
                                        size="small"
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            btn.onClick && btn.onClick(item as T)
                                        }}>
                                        {btn.label}
                                    </Button>
                                    :
                                    <IconButton 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            btn.onClick && btn.onClick(item as T)
                                        }}>
                                        {btn.icon}
                                    </IconButton>
                                   
                                }
                            </Tooltip>
                        )
                    }
                    
                </div>
            </TableRow>
            {
                expandedRowRender && 
                <TableRow sx={{ "& > *": { borderBottom: "unset"} }}>
                    <TableCell colSpan={columnKeys.length} className="!p-0">
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <div>
                                {expandedRowRender(item)}
                            </div>
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </>
    )
}

const genericMemo: <T>(c: T) => T = memo;
export default genericMemo(CCollapsibleRow);