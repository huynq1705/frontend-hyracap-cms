import React from "react";
import Box from "@mui/material/Box";
import clsx from "clsx";
import _ from "lodash";
import {
  DataTypeOrder,
  ItemOrder,
  ItemPicked,
  TypeDataItemOrder,
} from "@/types/order";
import { ItemCard } from "../item-card";
import styles from "@/assets/styles/create-order.module.scss";
import EmptyIcon from "@/components/icons/empty";
import { OrderContext } from "../../edit";

interface ProductPickedProps {
  type?: "control" | "view";
}

export default function ProductPicked(props: ProductPickedProps) {
  const { type = "control" } = props;
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const data = context?.values?.data;
  const actionsPayload = context?.actions;
  const actions = {
    remove: (item: any, type_data: TypeDataItemOrder) => {
      actionsPayload &&
        actionsPayload.setItemPicked(
          { id: item.value, type: type_data, ...item },
          "delete",
        );
    },
    decrease: (
      item: any,
      type_data: TypeDataItemOrder,
      quantity: number,
      uid_item: string,
    ) => {
      const { commission, commission_percentage } = item;
      actionsPayload &&
        actionsPayload.setItemPicked(
          {
            id: item.value,
            type: type_data,
            uid_item,
            commission: commission * quantity,
            commission_percentage: commission_percentage * quantity,
          },
          "update",
          quantity,
        );
    },
    increase: (
      item: any,
      type_data: TypeDataItemOrder,
      quantity: number,
      uid_item: string,
    ) => {
      const { commission, commission_percentage } = item;
      actionsPayload &&
        actionsPayload.setItemPicked(
          {
            id: item.value,
            type: type_data,
            uid_item,
            commission: commission * quantity,
            commission_percentage: commission_percentage * quantity,
          },
          "update",
          quantity,
        );
    },
    change: (
      item: any,
      type_data: TypeDataItemOrder,
      quantity: number,
      uid_item: string,
    ) => {
      const { commission, commission_percentage } = item;
      actionsPayload &&
        actionsPayload.setItemPicked(
          {
            id: item.value,
            type: type_data,
            uid_item,
            commission: commission * quantity,
            commission_percentage: commission_percentage * quantity,
          },
          "update",
          quantity,
        );
    },
  };
  const listItemPicked = orderCurrent?.itemPicked
    .map((it) => {
      const data_find =
        data && data[it.type].source.find((x) => x.value === it.id);
      if (!data_find) return null;
      return {
        ...data_find,
        type: it.type,
        quantity: it.quantity,
        uid: it.uid,
      };
    })
    .filter((x: any) => x);
  return (
    <Box className="h-full">
      {!!listItemPicked?.length && (
        <div
          className={clsx(
            "h-full w-full mt-3 flex gap-3 flex-col",
            styles.item_2_list_product,
          )}
        >
          {listItemPicked?.map((item: any) => (
            <ItemCard
              isItemSelected={false}
              item={item}
              setItemID={() => {}}
              type={type}
              actions={actions}
              type_data={item.type}
            />
          ))}
        </div>
      )}

      {!orderCurrent?.itemPicked?.length && (
        <div className="w-full h-full flex justify-center items-center">
          <EmptyIcon />
        </div>
      )}
    </Box>
  );
}
