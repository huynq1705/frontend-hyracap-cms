import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardItem from "../item-card";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { OrderContext } from "@/apps/pages/order/edit";
import { useContext } from "react";
export const ListCard: React.FC<any> = (props: any) => {
  const {
    title,
    data,
    hiddenTitle = false,
    onClick = () => {
      alert("on click");
    },
    id = 0,
    id_active = null,
    directionHistory = () => {},
    width = "100%",
  } = props;
  const context = useContext(OrderContext);
  const data_payload = context?.values.data;
  const services = (list_service: any[]) =>
    data_payload?.service.source.filter((x) => list_service.includes(+x.value));
  console.log("data :", { id_active, data });
  const list_card =
   true ? data : data.filter((x: any) => x.id == id_active);
  return (
    <div className="w-full">
      {/* header */}
      <div
        className={clsx("flex items-center gap-2", hiddenTitle && "!hidden")}
      >
        <b className="text-[18px]">{title}</b>
        <div className="!w-[2px] h-5 bg-[#D0D5DD]"></div>
        <span
          className="text-[var(--text-color-primary)] text-sm cursor-pointer"
          onClick={directionHistory}
        >
          Lịch sử sử dụng thẻ
          <FontAwesomeIcon
            icon={faAngleRight}
            className="ml-2 inline-block h-[14px]"
          />
        </span>
      </div>
      {/* content */}
      <div className="flex gap-4 items-start flex-wrap mt-3 ">
        {list_card &&
          Array.isArray(list_card) &&
          list_card.map((card, index) => (
            <div key={"card-item" + index} style={{
              width,
            }}>
              <CardItem data={card} onClick={onClick} id={id} width="100%" />
              {card?.list_service_in_card && (
                <>
                  <h3 className="mt-2 text-sm">Danh sách dịch vụ :</h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {services(card.list_service_in_card)
                      ?.map((x) => x.name)
                      .map((x) => (
                        <div
                          key={x}
                          className="border border-solid border-[var(--text-color-primary)] px-2 py-1 rounded-xl bg-[var(--text-color-primary)] text-white"
                        >
                          {x}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
