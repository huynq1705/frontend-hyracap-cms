import * as React from "react";

function SuccessIcon(props: any) {
  return (
    <svg
      width={140}
      height={156}
      viewBox="0 0 140 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_3622_176798)">
        <rect
          x={24.25}
          y={16.2524}
          width={91}
          height={91}
          rx={20}
          fill="#50945D"
          shapeRendering="crispEdges"
        />
        <g filter="url(#filter1_d_3622_176798)">
          <path
            d="M78.654 40.502H60.846c-7.735 0-12.346 4.612-12.346 12.347v17.786c0 7.756 4.611 12.367 12.346 12.367h17.786c7.736 0 12.347-4.61 12.347-12.346V52.85c.021-7.735-4.59-12.347-12.325-12.347zm1.254 16.363l-12.05 12.049a1.592 1.592 0 01-2.252 0L59.593 62.9a1.603 1.603 0 010-2.253 1.603 1.603 0 012.252 0l4.888 4.888 10.922-10.923a1.603 1.603 0 012.252 0 1.603 1.603 0 010 2.253z"
            fill="#fff"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_3622_176798"
          x={0.25}
          y={16.2524}
          width={139}
          height={139}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius={10}
            in="SourceAlpha"
            result="effect1_dropShadow_3622_176798"
          />
          <feOffset dy={24} />
          <feGaussianBlur stdDeviation={17} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.180469 0 0 0 0 0.461198 0 0 0 0 0.342428 0 0 0 0.3 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3622_176798"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_3622_176798"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_3622_176798"
          x={20.25}
          y={30.2524}
          width={99}
          height={99}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={18} />
          <feGaussianBlur stdDeviation={12} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3622_176798"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_3622_176798"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default SuccessIcon;
