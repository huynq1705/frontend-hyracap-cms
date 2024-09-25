import Path from "@/utils/path";
import * as React from "react";

export interface CIconProps {
  name: string;
  width?: number;
  height?: number;
}

export default function CIcon(props: CIconProps) {
  const { name, width, height } = props;
  return (
    <div
      style={{
        width,
        height,
      }}
    >
      <img src={`${`../../assets/icons/${name}.svg`}`} alt="icon" />
    </div>
  );
}
