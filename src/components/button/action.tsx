import { faEye, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import IconView from "../icons/view";
import IconTrash from "../icons/trash";
import IconEdit from "../icons/edit";

const style: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "none",
  fontSize: "18px",
  fontWeight: "300",
  color: "#ccc",
  cursor: "pointer",
};
export interface ActionButtonProps {
  type: "view" | "remove" | "edit";
  onClick?: (...arg: any) => void;
  className?: string;
}
export default function ActionButton(props: ActionButtonProps) {
  let ICON = <IconView color="#475467" />;
  const { type, onClick, className } = props;
  if (type === "remove") ICON = <IconTrash color="#475467" />;
  if (type === "edit") ICON = <IconEdit color="#475467" />;
  return (
    <button
      style={style}
      onClick={() => {
        onClick ? onClick() : alert(`Tính năng đang cập nhật`);
      }}
      className={className}
    >
      {ICON}
    </button>
  );
}
