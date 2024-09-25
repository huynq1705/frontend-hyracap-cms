import React from "react";
import { Slide, SlideProps } from "@mui/material";

type TransitionProps = {
  direction: "left" | "right" | "up" | "down"; // Định nghĩa các hướng có thể
} & SlideProps;

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition({ direction, children, ...restProps }, ref) {
    return (
      <Slide direction={direction} ref={ref} {...restProps}>
        {children}
      </Slide>
    );
  },
);

export default Transition;
