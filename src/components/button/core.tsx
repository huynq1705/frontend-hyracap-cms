import { Button } from "antd";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
interface ButtonCoreProps {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "default" | "bgWhite" | "remove" | "secondary" | "borderColor";
  iconPosition?: "start" | "end";
  icon?: React.ReactElement;
  styles?: React.CSSProperties;
  onClick?: (e?: any) => void;
}
const btnStyleDefault = {
  backgroundColor: "var(--btn-color-primary)",
  borderColor: "var(--btn-color-primary)",
};
const btnStyleBgWhite = {
  backgroundColor: "var(--btn-color-secondary)",
  color: "var(--btn-color-primary)",
};
const btnStyleBorderColor = {
  backgroundColor: "var(--btn-color-secondary)",
  color: "#875BF7",
  border: "2px solid #875BF7",
};
const btnStyleRemove = {
  backgroundColor: "var(--btn-color-secondary)",
  borderColor: "var(--error-color)",
  color: "var(--error-color)",
};
const btnStyleSecondary = {
  backgroundColor: "transparent",
  borderColor: "transparent",
  color: "var(--btn-color-primary)",
};
const id = uuidv4();
export default function ButtonCore(props: ButtonCoreProps) {
  const {
    title,
    type = "default",
    icon,
    styles,
    loading,
    iconPosition = "start",
    disabled = false,
    onClick,
  } = props;
  let btnStyle: any = btnStyleDefault;
  if (type === "bgWhite") btnStyle = btnStyleBgWhite;
  if (type === "borderColor") btnStyle = btnStyleBorderColor;
  if (type === "remove") btnStyle = btnStyleRemove;
  if (type === "secondary") btnStyle = btnStyleSecondary;
  if (styles) btnStyle = { ...btnStyle, ...styles };
  return (
    <Button
      id={id}
      type="primary"
      style={btnStyle}
      icon={icon}
      onClick={() =>
        onClick ? onClick() : alert(`"Tính năng ${title} đang phát triển!"`)
      }
      loading={loading}
      className="button-core"
      iconPosition={iconPosition}
      disabled={disabled}
      size={"middle"}
    >
      {title}
    </Button>
  );
}
