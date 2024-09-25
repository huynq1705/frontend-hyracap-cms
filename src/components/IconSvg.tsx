import { IconName } from "@/types/icon.type";
import Path from "@/utils/path";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import parse, { domToReact } from "html-react-parser";
import React, { memo } from "react";

const IconSvg = ({
  name,
  usePresetClassname = true,
  ...props
}: any): JSX.Element => {
  const { data } = useQuery({
    queryKey: ["GET_ICON_SVG", name],
    queryFn: () =>
      axios
        .get<string>(`${Path.get(`../../assets/icons/${name}.svg`)}`, {
          headers: {
            "Content-Type": "image/svg+xml",
          },
          responseType: "text",
        })
        .then((res) => res.data),
  });

  return (
    // <>
    //     <Icon
    //         {...props}
    //         cacheRequests={true}
    //         src={`${Path.get(`../../assets/icons/${name}.svg`)}`}
    //         className={clsx(props.className, usePresetClassname && `
    //             [&_svg]:fill-[currentcolor]
    //             [&>rect]:stroke-[currentcolor]
    //             [&>circle]:stroke-[currentcolor]
    //             [&>line]:stroke-[currentcolor]
    //             [&>polygon]:stroke-[currentcolor]
    //             [&>polyline]:stroke-[currentcolor]
    //             [&>path]:fill-[currentcolor]
    //             `
    //         )}
    //         />
    // </>
    <>
      {data &&
        parse(data, {
          replace(domNode: any) {
            if (domNode.attribs) {
              return (
                <svg
                  fill="#50945D"
                  {...domNode.attribs}
                  className={clsx(
                    props.className,
                    usePresetClassname &&
                      `
                                    [&_svg]:fill-[currentcolor] 
                                    [&>rect]:stroke-[currentcolor] 
                                    [&>circle]:stroke-[currentcolor] 
                                    [&>line]:stroke-[currentcolor] 
                                    [&>polygon]:stroke-[currentcolor] 
                                    [&>polyline]:stroke-[currentcolor] 
                                    `,
                  )}
                >
                  {domNode?.children && domToReact(domNode?.children)}
                </svg>
              );
            }
          },
        })}
    </>
  );
};

export default memo(IconSvg);
