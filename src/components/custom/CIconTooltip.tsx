import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from "@mui/material";
import { memo } from "react";
import useCustomTranslation from "../../hooks/useCustomTranslation";
import HtmlTooltip from '../mui/HtmlTooltip';


type CTooltipProps = {
    title: string,
}

const CIconTooltip = ({
    title
}: CTooltipProps): JSX.Element => {
    const { T } = useCustomTranslation();

    return (
        <>
            {
                title &&
                <HtmlTooltip
                    disableInteractive
                    title={T(title)}>
                    <IconButton
                        size="small">
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </HtmlTooltip>
            }
        </>
    )
}

export default memo(CIconTooltip);