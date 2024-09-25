import { Box } from "@mui/material";
import { Tooltip } from "antd";
interface CTooltipProps {
  text: string;
}
const CTooltip: React.FC<CTooltipProps> = ({ text }: CTooltipProps) => {
  const tooltip = text;
  const content = tooltip.length > 20 ? tooltip.slice(0, 30) + "..." : tooltip;
  return (
    <Box>
      <Tooltip placement="topLeft" title={tooltip}>
        {content}
      </Tooltip>
    </Box>
  );
};
export default CTooltip;
