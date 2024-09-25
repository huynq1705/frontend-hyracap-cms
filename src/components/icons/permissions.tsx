import * as React from "react";

function PermissionsIcon(props : any) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.667 9.166c1.943-2.035 4.703-2.13 6.667 0M7.08 3.75c0 1.15-.934 2.083-2.087 2.083A2.085 2.085 0 012.907 3.75c0-1.15.934-2.083 2.086-2.083 1.152 0 2.087.932 2.087 2.083zM11.667 18.333c1.943-2.035 4.703-2.131 6.667 0m-1.254-5.417c0 1.15-.934 2.084-2.087 2.084a2.085 2.085 0 01-2.086-2.084c0-1.15.934-2.083 2.086-2.083 1.152 0 2.087.933 2.087 2.083zM2.5 11.667A5.829 5.829 0 008.333 17.5v-2.083M12.5 2.5h5m-5 2.5h5m-5 2.5h2.917"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PermissionsIcon;
