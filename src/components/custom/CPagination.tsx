import useCustomTranslation from "@/hooks/useCustomTranslation";
import { TablePagination, TablePaginationProps } from "@mui/material";
import { memo } from "react";

type CPaginationProp = TablePaginationProps;

const CPagination = ({
    ...props
}: CPaginationProp): JSX.Element => {
    const {T, t} = useCustomTranslation();

    return (
        <TablePagination
            component="div"
            className="bg-gray-1 rounded"
            rowsPerPageOptions={[10, 20, 50]}
            labelDisplayedRows={({ from, to, count, page }) => `${from}–${to} ${t('of')} ${count !== -1 ? count : `${t('moreThan')} ${to}`} ${t('item')}`}
            labelRowsPerPage={T(`itemsPerPage`)}
            {...props}
            />
    )
}

export default memo(CPagination)