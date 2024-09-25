import { Box } from "@mui/material";
import clsx from "clsx";
export interface TagProps {
    title?: string;
    color : string
}

export default function Tag(props: TagProps) {
    const { color, title } = props;
    return (
        <Box
            sx={{
                color,
                border: "1px solid",
                borderColor: color,
                minWidth: "80px",
            }}
            className={clsx(
                "rounded-lg flex flex-row gap-2 px-2 py-1 w-fit h-fit items-center text-xs capitalize relative font-medium",
            )}
        >
            <Box className="absolute top-0 right-0 left-0 bottom-0 rounded-lg" sx={{ opacity: 0.1, bgcolor: color }} />

            <Box
                className="w-2 h-2 rounded-full"
                sx={{
                    backgroundColor: color,
                }}
            ></Box>
            {title}

        </Box>
    );
}
