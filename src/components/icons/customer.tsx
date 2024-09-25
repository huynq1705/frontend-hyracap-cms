import * as React from "react";

function CustomerIcon(props : any) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx={10.0003}
        cy={9.99984}
        r={8.33333}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        d="M6.25 14.166c1.943-2.035 5.536-2.13 7.5 0m-1.67-6.25c0 1.15-.935 2.084-2.087 2.084a2.085 2.085 0 01-2.086-2.084c0-1.15.934-2.083 2.086-2.083 1.152 0 2.086.933 2.086 2.083z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default CustomerIcon;
