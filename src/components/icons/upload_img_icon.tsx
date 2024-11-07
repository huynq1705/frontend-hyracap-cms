import * as React from "react";

function UploadImgIcon() {
    return (
        <svg
            width={72}
            height={72}
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            //   {...props}
        >
            <rect width={72} height={72} rx={36} fill="#E0EEFE" />
            <path
                d="M36 22v20m0-20c-1.4 0-4.017 3.989-5 5m5-5c1.4 0 4.017 3.989 5 5M22 50h28"
                stroke="#0D63F3"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default UploadImgIcon;
