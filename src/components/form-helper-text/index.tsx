import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormHelperText } from "@mui/material";
import * as React from "react";

export interface FormHelperTextCustomProps {
  text: string;
}

export default function FormHelperTextCustom(props: FormHelperTextCustomProps) {
  return (
    <FormHelperText
      sx={{
        ml: 0,
        display: "flex",
        gap: "8px",
        alignItems: "center",
        color:"#d32f2f"
      }}
    >
      <FontAwesomeIcon icon={faCircleExclamation} />
      {props.text}
    </FormHelperText>
  );
}
