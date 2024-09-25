import { Skeleton, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { memo } from "react";

const TOTAL_LOADING = 10;
type CTableLoadingProps = {
    colCount: number,
    numRows?: number
}

const CTableLoading = ({
    colCount,
    numRows = TOTAL_LOADING
}: CTableLoadingProps): JSX.Element => {

    return (
        <TableBody>
            {
                Array(numRows).fill(0).map((_,i) => 
                <TableRow
                    className="cursor-pointer animate-fadeup hover:shadow relative group"
                    key={i}>
                    {
                        Array(colCount).fill(0).map((_,idx) => 
                            <TableCell key={idx} className="!text-gray-10">
                                <Typography component="div" variant={"caption"}>
                                    <Skeleton 
                                        className="!bg-gray-2"
                                        variant="rounded"
                                        animation="wave"
                                        width="100%"/>
                                </Typography>
                            </TableCell>
                        )
                    }
                </TableRow>
                )
            }
        </TableBody>
    )
}

export default memo(CTableLoading)