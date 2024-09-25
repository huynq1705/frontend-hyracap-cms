import { Tooltip, TooltipProps, Zoom, styled, tooltipClasses } from "@mui/material";
import { memo } from "react";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip 
        {...props}
        arrow={false}
        TransitionComponent={Zoom}
        classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));


export default memo(HtmlTooltip)