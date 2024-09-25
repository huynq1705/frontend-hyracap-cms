import * as React from "react";

function CartVS(props: any) {
    return (
        <svg width="73" height="72" viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path d="M6.5 36C6.5 25.3875 6.5 20.0813 9.6584 16.5387C10.1636 15.9721 10.7203 15.4481 11.3224 14.9726C15.0864 12 20.7243 12 32 12H41C52.2757 12 57.9136 12 61.6776 14.9726C62.2797 15.4481 62.8364 15.9721 63.3416 16.5387C66.5 20.0813 66.5 25.3875 66.5 36C66.5 46.6125 66.5 51.9187 63.3416 55.4613C62.8364 56.0279 62.2797 56.5519 61.6776 57.0274C57.9136 60 52.2757 60 41 60H32C20.7243 60 15.0864 60 11.3224 57.0274C10.7203 56.5519 10.1636 56.0279 9.6584 55.4613C6.5 51.9187 6.5 46.6125 6.5 36Z" stroke={props.fill} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M30.5 48H35" stroke={props.fill} stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M44 48L54.5 48" stroke={props.fill} stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.5 27H66.5" stroke={props.fill} stroke-width="2" stroke-linejoin="round" />
        </svg>


    );
}

export default CartVS;
