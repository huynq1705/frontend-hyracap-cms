import * as React from "react";

function ScheduleIcon(props : any) {
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
        d="M14 1.667v1.666M4 1.666v1.667"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.996 10.833h.007m-.007 3.333h.007m3.322-3.333h.008m-6.667 0h.007m-.007 3.333h.007"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.916 6.667h14.167M1.083 10.203c0-3.631 0-5.447 1.043-6.575C3.17 2.5 4.85 2.5 8.208 2.5h1.583c3.36 0 5.038 0 6.082 1.128 1.043 1.128 1.043 2.944 1.043 6.575v.428c0 3.63 0 5.446-1.043 6.574-1.043 1.128-2.723 1.128-6.082 1.128H8.208c-3.359 0-5.038 0-6.082-1.128-1.043-1.128-1.043-2.943-1.043-6.574v-.428zM1.5 6.667h15"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ScheduleIcon;
