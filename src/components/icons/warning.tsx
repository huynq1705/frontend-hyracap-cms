import * as React from "react";

function WarningIcon(props: any) {
  return (
    <svg
      width={149}
      height={149}
      viewBox="0 0 149 149"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_697_35696)">
        <path
          d="M68.676 18.776a12.148 12.148 0 0112.148 0l27.689 15.987a12.147 12.147 0 016.074 10.52v31.973c0 4.34-2.315 8.35-6.074 10.52l-27.689 15.987a12.149 12.149 0 01-12.148 0l-27.69-15.987a12.148 12.148 0 01-6.073-10.52V45.283c0-4.34 2.315-8.35 6.074-10.52l27.689-15.987z"
          fill="#FDDEB5"
        />
      </g>
      <path
        stroke="#C67307"
        strokeWidth={0.911111}
        strokeLinecap="round"
        d="M40.4485 92.6288L60.6205 104.601"
      />
      <path
        stroke="#C67307"
        strokeWidth={0.911111}
        strokeLinecap="round"
        d="M42.1516 99.7841L51.7178 105.462"
      />
      <path
        d="M68.676 29.169a12.148 12.148 0 0112.148 0l18.689 10.79a12.15 12.15 0 016.074 10.52v21.58c0 4.34-2.316 8.351-6.074 10.521L80.824 93.37a12.149 12.149 0 01-12.148 0L49.987 82.58a12.148 12.148 0 01-6.074-10.52V50.48c0-4.34 2.316-8.351 6.074-10.521l18.689-10.79z"
        fill="#F79009"
      />
      <path
        d="M74.75 45.766v19.422M74.75 74.935v1.699"
        stroke="#fff"
        strokeWidth={5.46667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_697_35696"
          x={0.913086}
          y={7.14844}
          width={147.674}
          height={156.242}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={24} />
          <feGaussianBlur stdDeviation={17} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.968627 0 0 0 0 0.564706 0 0 0 0 0.0352941 0 0 0 0.19 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_697_35696"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_697_35696"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default WarningIcon;
