import * as React from "react";

function ReportIcon(props: any) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className="-translate-x-[1px]"
    >
      <path
        d="M12.5 2.083v1.25c0 1.179 0 1.768.366 2.134.366.367.956.367 2.134.367h1.25"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.333 13.333V6.667c0-2.357 0-3.536.732-4.268.733-.732 1.911-.732 4.268-.732h3.477c.34 0 .51 0 .664.063.153.064.273.184.514.425l3.19 3.19c.241.241.362.362.425.515.064.153.064.323.064.664v6.81c0 2.356 0 3.535-.733 4.267-.732.732-1.91.732-4.267.732H8.333c-2.357 0-3.535 0-4.268-.732-.732-.732-.732-1.91-.732-4.268zM6.667 9.167h6.666m-6.667 2.5h6.667m-6.667 2.5h3.476"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ReportIcon;
