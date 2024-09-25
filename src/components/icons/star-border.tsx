import * as React from "react";

function StarBorder(props: any) {
  return (
    <svg
      width={44}
      height={44}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M25.455 4.888l3.52 7.098c.48.988 1.76 1.935 2.84 2.117l6.379 1.069c4.08.685 5.04 3.67 2.1 6.613l-4.96 5c-.84.847-1.3 2.48-1.04 3.65l1.42 6.19c1.12 4.9-1.46 6.795-5.76 4.234l-5.979-3.569c-1.08-.645-2.86-.645-3.96 0l-5.979 3.57c-4.279 2.56-6.879.644-5.759-4.235l1.42-6.19c.26-1.17-.2-2.803-1.04-3.65l-4.96-5c-2.919-2.944-1.98-5.928 2.1-6.614l6.38-1.068c1.06-.182 2.34-1.13 2.82-2.117l3.519-7.098c1.92-3.85 5.04-3.85 6.94 0z"
        stroke="#F79009"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default StarBorder;
