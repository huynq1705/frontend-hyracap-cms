import * as React from "react";

function ServiceComponent(props: any) {
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
        d="M2.917 7.807c0-2.895 0-4.342.854-5.241.855-.9 2.23-.9 4.98-.9h2.5c2.75 0 4.124 0 4.978.9.855.899.855 2.346.855 5.24v4.387c0 2.894 0 4.342-.855 5.24-.854.9-2.229.9-4.979.9h-2.5c-2.75 0-4.124 0-4.979-.9-.854-.898-.854-2.346-.854-5.24V7.807z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.667 1.667l.068.41c.167.998.25 1.497.6 1.793.35.296.855.296 1.866.296H10.8c1.012 0 1.517 0 1.867-.296.35-.296.433-.795.6-1.792l.068-.411"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.667 13.333H10M6.667 9.166h6.667"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ServiceComponent;
