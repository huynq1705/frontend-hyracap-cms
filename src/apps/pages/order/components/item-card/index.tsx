import React, { useState } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Stack } from "@mui/material";
import { formatCurrency } from "@/utils";
import styles from "@/assets/styles/create-order.module.scss";
import { KeySearchType } from "@/types/types";
import SearchBoxTable from "@/components/search-box-table";
import { DataTypeOrder, ItemPicked, TypeDataItemOrder } from "@/types/order";
import { message, Select, Space } from "antd";
import EmptyIcon from "@/components/icons/empty";
import { OrderContext } from "../../edit";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MySelect from "@/components/input-custom-v2/select";
interface ItemCard {
  value: string;
  name: string;
  original_price: number | null;
  selling_price: number;
  use_time?: number;
  quantity: number;
  stock?: number;
  commission: number;
  [x: string]: any;
}

interface ItemCardProps {
  item: ItemCard;
  isItemSelected: boolean;
  setItemID: (data: any) => void;
  type?: "pic" | "control" | "view";
  type_data?: TypeDataItemOrder;
  actions?: any;
  toggleDataProductMobile?: any;
  [key: string]: any;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isItemSelected,
  setItemID,
  type = "pic",
  actions,
  type_data,
  toggleDataProductMobile,
  width = "100%",
}) => {
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const data = context?.values?.data;
  const actionsPayload = context?.actions;
  const [flagChange, setFlagChange] = useState(false);
  let icon_name = isItemSelected ? faCheck : faPlus;
  if (type === "control") icon_name = faTrash;
  const handleChangeEmployee = (value: string) => {
    const { commission, commission_percentage, quantity } = item;
    if (actionsPayload)
      actionsPayload.handleOnPicInfoEmployee(
        [value],
        commission * quantity,
        commission_percentage * quantity,
        item.uid,
      );
  };
  const dispatch = useDispatch();
  const uid_item = item.uid;
  const employee = orderCurrent?.employee?.find((x) => x.uid === uid_item);
  const ELEMENT = (
    <div className="flex gap-3 items-center text-xs">
      <div className="child:text-[#50945D]">
        <CheckCircleIcon />
      </div>
      <p className="text-white">Đã thêm sản phẩm vào đơn hàng!</p>
      <div className="w-[2px] h-5 bg-[#ccc]"></div>
      <button
        className="border-none text-[12px] w-1/3  bg-transparent text-white"
        onClick={() => {
          toggleDataProductMobile && toggleDataProductMobile();
        }}
      >
        Xem đơn hàng
      </button>
    </div>
  );
  const data_select = (data?.employee.source ?? []).map((x) => ({
    value: x.value,
    label: x.name,
  }));
  return (
    <div
      className={clsx("flex")}
      style={{
        width,
      }}
    >
      <div
        key={item.value}
        className={clsx(
          "w-full flex flex-row  gap-2",
          isItemSelected ? "cursor-none" : "cursor-pointer",
          type === "pic" && "hover:bg-[var(--bg-color-primary)]",
        )}
        onClick={() => {
          if (!isItemSelected && type === "pic" && window.innerWidth < 768) {
            dispatch(
              setGlobalNoti({
                type: "custom",
                message: ELEMENT,
                pos: {
                  horizontal: "center",
                  vertical: "bottom",
                },
              }),
            );
          }
          !isItemSelected && type === "pic" && setItemID(item.value);
        }}
      >
        {/* name */}
        <div className="flex-grow">
          <h3 className="font-bold text-base">{item.name}</h3>

          <Stack direction={"row"} className="gap-1">
            <span className="text-sm font-bold text-[var(--text-color-primary)]">
              {formatCurrency(item.selling_price)}{" "}
            </span>
            {item.original_price && type !== "view" && (
              <span className="text[#475467] text-sm line-through">
                {formatCurrency(item.original_price)}
              </span>
            )}
          </Stack>

          {item.use_time && type === "pic" && (
            <div className="bg-[#F3F7FE] text-[#0D63F3] px-2 py-1 w-fit rounded-md mt-2">
              HSD : {item.use_time} ngày
            </div>
          )}
          {item?.stock && type === "control" && (
            <div className="bg-[#F3F7FE] text-[#0D63F3] px-2 py-1 w-fit rounded-md mt-2">
              SL : {item.stock}
            </div>
          )}
          {/* control */}
          {type === "control" && (
            <div className="flex flex-col mt-6 gap-4">
              {/* staff */}
              <div className="w-full flex flex-wrap  items-center">
                <MySelect
                  configUI={{
                    width: "100%",
                  }}
                  direction="row"
                  label=""
                  name="staff"
                  handleChange={(e) => {
                    e.target.value && handleChangeEmployee(e.target.value);
                  }}
                  values={{ staff: employee?.account_id?.toString() ?? null }}
                  options={data_select}
                  errors={[]}
                  validate={{}}
                  required={[]}
                  itemsPerPage={5} // Adjust items per page as needed
                />
                <p className="text-xs text-[var(--text-color-primary)] pl-2">
                  {`${
                    employee?.commission_percentage ?? "- -"
                  }  %, ${formatCurrency(employee?.commission ?? 0)}
                  `}
                </p>
              </div>
              {/*  */}
              <div className="flex">
                <div
                  className="h-10 w-11 border-2 border-solid border-[#D0D5DD] flex justify-center items-center hover:bg-[var(--bg-color-primary)] rounded-l-lg"
                  onClick={() =>
                    actions?.decrease &&
                    item.quantity > 1 &&
                    actions.decrease(
                      item,
                      type_data,
                      item.quantity - 1,
                      uid_item,
                    )
                  }
                >
                  <FontAwesomeIcon icon={faMinus} />
                </div>
                <div
                  className="h-10 w-11 border-2 border-solid border-y-[#D0D5DD] border-x-transparent flex justify-center items-center hover:bg-[var(--bg-color-primary)]"
                  onMouseEnter={() => setFlagChange(!flagChange)}
                  onMouseLeave={() => setFlagChange(!flagChange)}
                >
                  {!flagChange && item.quantity}
                  {flagChange && (
                    <input
                      type="number"
                      value={item.quantity}
                      max={1000}
                      min={1}
                      className="block h-full w-full border-none focus:border-none focus:outline-none mx-1"
                      onChange={(e) => {
                        const { value } = e.target;
                        let convert_quantity = +value;
                        if (+value < 0 || +value > 100) convert_quantity = 1;
                        actions?.change &&
                          actions.change(
                            item,
                            type_data,
                            convert_quantity,
                            uid_item,
                          );
                      }}
                    />
                  )}
                </div>
                <div
                  className="h-10 w-11 border-2 border-solid border-[#D0D5DD] flex justify-center items-center hover:bg-[var(--bg-color-primary)] rounded-r-lg"
                  onClick={() =>
                    actions?.increase &&
                    item.quantity < (item.stock ?? 1000) &&
                    actions.increase(
                      item,
                      type_data,
                      item.quantity + 1,
                      uid_item,
                    )
                  }
                >
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* quantity */}
        {type === "view" && (
          <b className="text-lg text-[var(--text-color-primary)]">
            x{item.quantity}
          </b>
        )}
        {/* remove */}
        {type !== "view" && (
          <div
            className="h-6 w-6"
            onClick={() => actions?.remove && actions.remove(item, type_data)}
          >
            <FontAwesomeIcon
              icon={icon_name}
              color={
                isItemSelected && type === "pic"
                  ? "var(--text-color-primary)"
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
// -------- end component item card

interface ButtonType {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export const Button: React.FC<ButtonType> = ({ name, isActive, onClick }) => (
  <button
    className={clsx(
      "h-7 rounded-[40px] py-1 px-[10px] cursor-pointer",
      isActive
        ? "bg-[#F6FAF7] text-[var(--text-color-primary)] border-[var(--text-color-primary)]"
        : "bg-[#fff] text-[#000] border-[#D0D5DD]",
    )}
    onClick={onClick}
    style={{ border: "1px solid" }}
  >
    {name}
  </button>
);
interface ElementCardProps {
  type: keyof DataTypeOrder;
  toggleDataProductMobile?: any;
  setTypeTagService?: null | ((value: "course" | "prepay") => void);
}
const ElementCard: React.FC<ElementCardProps> = ({
  type,
  toggleDataProductMobile,
  setTypeTagService,
}) => {
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const data = context?.values?.data;
  const actions = context?.actions;
  const [keySearch, setKeySearch] = useState<KeySearchType>({});

  const listItemPicked = orderCurrent
    ? orderCurrent.itemPicked
        .filter((it) => it.type === type)
        .map((item) => item.id)
    : [];

  const handleSetItemID = (id: string, name: string, price: any) => {
    if (!listItemPicked.includes(id)) {
      actions && actions.setItemPicked({ id, type, name, price }, "create");
    }
  };
  return (
    <div className="h-full flex flex-col">
      {setTypeTagService && (
        <div className="h-fit my-3 flex gap-3 items-center">
          <Button
            name="Thẻ trả trước"
            isActive={type === "prepay"}
            onClick={() => setTypeTagService("prepay")}
          />
          <Button
            name="Thẻ liệu trình"
            isActive={type === "course"}
            onClick={() => setTypeTagService("course")}
          />
        </div>
      )}
      <div className="h-fit w-full">
        <SearchBoxTable
          placeholder="Tìm theo tên, mã sản phẩm"
          keySearch={keySearch?.name__like ?? ""}
          setKeySearch={(value?: string) => {
            setKeySearch((prev) => ({
              ...prev,
              name__like: value || "",
            }));
          }}
          handleSearch={() =>
            actions &&
            actions.handleSearch(keySearch?.name__like?.toString(), type)
          }
        />
      </div>
      {keySearch?.name_like && (
        <div className="mt-3 text-sm">
          Tìm thấy 3 sản phẩm phù hợp với{" "}
          <b>{`"${keySearch?.name_like ?? ""}"`}</b>{" "}
        </div>
      )}
      <div
        className={clsx(
          "flex-grow w-full mt-3 flex gap-3 flex-col",
          styles.item_1_list_product,
        )}
      >
        {data &&
          !!data[type].show.length &&
          data[type].show.map((item) => (
            <ItemCard
              item={item}
              isItemSelected={!!listItemPicked.find((it) => it === item.value)}
              key={item.value}
              setItemID={() =>
                handleSetItemID(item.value, item.name, item.selling_price)
              }
              toggleDataProductMobile={toggleDataProductMobile}
            />
          ))}
        {data && !data[type].show.length && (
          <div className="w-full h-full flex justify-center items-center">
            <EmptyIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export { ItemCard, ElementCard };
