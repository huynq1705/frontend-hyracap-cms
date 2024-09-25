import  React from "react";

function IconEdit(props: any) {
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
        d="M9.2 3H7.6C3.6 3 2 4.5 2 8.25v4.5C2 16.5 3.6 18 7.6 18h4.8c4 0 5.6-1.5 5.6-5.25v-1.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.097 3.004l-6.22 6.22c-.237.237-.474.703-.521 1.043l-.34 2.376c-.126.86.482 1.46 1.343 1.342l2.375-.34c.332-.047.798-.284 1.042-.52l6.22-6.221c1.074-1.074 1.58-2.321 0-3.9-1.578-1.58-2.825-1.074-3.899 0zM12 4a5.785 5.785 0 004 4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IconEdit;
