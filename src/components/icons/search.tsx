import * as React from "react";

function SearchNormal(props: any) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.625 15.75a7.125 7.125 0 100-14.25 7.125 7.125 0 000 14.25zM16.5 16.5L15 15"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SearchNormal;
