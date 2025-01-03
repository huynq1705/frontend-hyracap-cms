import  React from "react";

function IconTrash(props: any) {
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
        d="M16.25 4.583l-.516 8.354c-.132 2.135-.198 3.202-.733 3.97-.265.379-.605.699-1 .94-.8.486-1.868.486-4.007.486-2.141 0-3.212 0-4.011-.487a3.334 3.334 0 01-1-.942c-.536-.769-.6-1.838-.73-3.975L3.75 4.583M2.5 4.583h15m-4.12 0l-.57-1.173c-.377-.78-.566-1.17-.892-1.413a1.67 1.67 0 00-.229-.143c-.36-.188-.794-.188-1.66-.188-.888 0-1.332 0-1.7.196a1.667 1.667 0 00-.231.149c-.33.253-.514.657-.883 1.465l-.504 1.107M7.917 13.75v-5M12.083 13.75v-5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default IconTrash;
