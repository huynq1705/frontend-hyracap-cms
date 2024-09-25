import * as React from "react";

function CartIcon(props : any) {
  return (
    <svg
      width={18}
      height={20}
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.667 13.333h6.052c3.74 0 4.309-2.35 4.999-5.776.198-.988.298-1.482.059-1.811-.24-.33-.698-.33-1.615-.33H4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M5.666 13.333L3.482 2.93a1.667 1.667 0 00-1.617-1.262h-.782"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M6.4 13.333h-.343c-1.136 0-2.057.96-2.057 2.143a.35.35 0 00.343.357h9.24"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx={7.75}
        cy={17.083}
        rx={1.25}
        ry={1.25}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <ellipse
        cx={13.583}
        cy={17.083}
        rx={1.25}
        ry={1.25}
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export default CartIcon;
