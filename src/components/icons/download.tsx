import * as React from "react";

function DownIcon(props: any) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 15V5m0 10c-.7 0-2.008-1.994-2.5-2.5M12 15c.7 0 2.008-1.994 2.5-2.5M5 19h14"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default DownIcon;
