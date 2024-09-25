import apiOrderService from "@/api/apiOrder.service";
import { cloneAndAddObjects, formatCurrency } from "@/utils";
import { handleGetDataCommon } from "@/utils/fetch";
import { Empty } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../edit";
import _ from "lodash";
import { ListCard } from "@/components/list-card";
interface ListCard {
  payment: any;
}
function ListTreatmentCard(props: ListCard) {
  const { payment } = props;
  const context = useContext(OrderContext);
  const [card, setCard] = useState(0);
  const orderCurrent = context?.values.orderCurrent;
  const actions = context?.actions;
  const [treatmentCard, setTreatmentCard] = useState<any[]>([]);
  const { getServiceCard } = apiOrderService();
  const service_picked = cloneAndAddObjects(
    orderCurrent?.itemPicked.filter((x) => x.type == "service") ?? [],
  );
  const init = () => {
    const customer_id = context?.values?.orderCurrent?.customer?.id;
    if (!customer_id) return;
    const convertTreatment = (array: any[]) => {
      return array
        .map((it) => {
          const dateNow = new Date();
          const dateExpiration = new Date(it.expiration_date);
          const list_service = it.order_detail.treatment.treatment_service.map(
            (x: any) => x.service_id,
          );
          const result: any = {
            id: it.id,
            id_card: 1,
            type: dateNow < dateExpiration,
            name: it.order_detail.name,
            payment: {
              amount: {
                value: it.number_of_remaining_treatments,
                title: "Số buổi còn lại",
                color: "#7A52DE",
              },
              total: {
                value:
                  it.number_of_treatment_used +
                  it.number_of_remaining_treatments,
                title: "Tổng số buổi",
              },
              collect: {
                value: it.number_of_treatment_used,
                title: "Đã sử dụng",
              },
            },
            use_date: it.expiration_date,
            list_service,
            list_service_in_card: _.intersection(
              service_picked?.map((x) => +x.id) ?? [],
              list_service,
            ),
          };
          return result;
        })
        .filter((x) => {
          return (
            x.list_service_in_card.length &&
            x.list_service.length &&
            x.payment.amount.value &&
            x.type
          );
        });
    };
    handleGetDataCommon(
      () => getServiceCard(+customer_id, "treatment"),
      convertTreatment,
      setTreatmentCard,
    );
  };
  useEffect(() => {
    init();
  }, []);
  const handleOnClick = (id: number) => {
    const methods = orderCurrent?.payment_methods ?? [];
    setCard(id);
    const card = treatmentCard.find((x) => x.id == id);
    const count_card = +card?.payment.amount.value ?? 0;

    let service_picked_filted = service_picked.filter((x) =>
      card?.list_service?.includes(+x.id),
    );
    if (count_card < (service_picked_filted?.length ?? 0)) {
      service_picked_filted = service_picked_filted.slice(0, count_card);
    }
    let paid = service_picked_filted?.reduce(
      (sum: any, item: any) =>
        (sum += item.price * (1 + (orderCurrent?.payment?.VAT ?? 0) / 100)),
      0,
    );

    orderCurrent?.payment_methods &&
      actions &&
      actions.handleChangeOrder(
        "payment_methods",
        methods.map((x) =>
          x.id === payment.id
            ? {
                ...x,
                order_detail_information_id: id,
                paid,
                total_treatment: service_picked_filted.length,
                list_service_id: service_picked_filted
                  .map((x) => +x?.id)
                  .filter((x) => x),
              }
            : x,
        ),
      );
  };
  console.log("payment:", { payment });
  return (
    <div className="w-full">
      <ListCard
        title="Thẻ trả trước"
        data={treatmentCard}
        hiddenTitle={true}
        onClick={handleOnClick}
        id={card}
        id_active={payment.id_card}
      />
      {treatmentCard.length < 1 && (
        <Empty
          className="w-full justify-center items-center"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
}
// -------
function ListPrepaidCard(props: ListCard) {
  const { payment } = props;
  const context = useContext(OrderContext);
  const orderCurrent = context?.values.orderCurrent;
  const actions = context?.actions;
  const [prepaidCard, setPrepaidCard] = useState<any[]>([]);
  const { getServiceCard } = apiOrderService();
  const init = () => {
    const customer_id = context?.values?.orderCurrent?.customer?.id;
    if (!customer_id) return;
    const convertPrepaid = (array: any[]) => {
      return array
        .map((it) => {
          const dateNow = new Date();
          const dateExpiration = new Date(it.expiration_date);
          const result: any = {
            type: dateNow < dateExpiration,
            name: it.order_detail.name,
            payment: [
              {
                title: "Số dư khả dụng",
                value: formatCurrency(it.remaining_amount_of_prepaid_card),
                color: "#7A52DE",
              },
              {
                title: "Tổng tiền",
                value: formatCurrency(it.unit_price),
              },
              {
                title: "Đã sử dụng",
                value: formatCurrency(it.amount_used),
              },
            ],
            use_date: it.expiration_date,
            id: it.id,
            remaining_amount_of_prepaid_card:
              it.remaining_amount_of_prepaid_card,
          };
          return result;
        })
        .filter(
          (x) =>
            x.type &&
            x.payment[0].value !== formatCurrency(0) &&
            x.remaining_amount_of_prepaid_card >=
              (orderCurrent?.payment?.total ?? 0),
        );
    };
    handleGetDataCommon(
      () => getServiceCard(+customer_id, "prepaid"),
      convertPrepaid,
      setPrepaidCard,
    );
  };
  const [card, setCard] = useState(0);
  const handleOnClick = (id: number) => {
    const methods = orderCurrent?.payment_methods ?? [];
    setCard(id);
    const amount_card =
      prepaidCard.find((x) => x.id == id)?.remaining_amount_of_prepaid_card ??
      0;

    const paid =
      (orderCurrent?.payment?.total ?? 0) -
      methods.reduce((sum, item) => (sum += item.paid), 0);
    orderCurrent?.payment_methods &&
      actions &&
      actions.handleChangeOrder(
        "payment_methods",
        methods.map((x) =>
          x.id === payment.id
            ? {
                ...x,
                order_detail_information_id: id,
                paid: paid > amount_card ? amount_card : paid,
              }
            : x,
        ),
      );
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="w-full">
      <ListCard
        title="Thẻ trả trước"
        data={prepaidCard}
        hiddenTitle={true}
        onClick={handleOnClick}
        id={card}
      />
      {prepaidCard.length < 1 && (
        <Empty
          className="w-full justify-center items-center"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
}
export { ListTreatmentCard, ListPrepaidCard };
