import * as React from "react";

function MicIcon(props: any) {
    return (
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M51 21V33C51 41.2843 44.2843 48 36 48C27.7157 48 21 41.2843 21 33V21C21 12.7157 27.7157 6 36 6C44.2843 6 51 12.7157 51 21Z" 
            stroke={props.fill} stroke-width="2" />
            <path d="M51 21H42M51 33H42" 
            stroke={props.fill} stroke-width="2" stroke-linecap="round" />
            <path d="M60 33C60 46.2548 49.2548 57 36 57M36 57C22.7452 57 12 46.2548 12 33M36 57V66M36 66H45M36 66H27" 
            stroke={props.fill} stroke-width="2" stroke-linecap="round" />
        </svg>


    );
}

export default MicIcon;
