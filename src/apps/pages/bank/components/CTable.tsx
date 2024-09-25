import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  PaginationProps,
  Image,
} from "antd";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";

import { INIT_PAYMENT_METHOD } from "@/constants/init-state/payment_menthod";
import apiPaymentMethodService from "@/api/apiPayment.service";
import CStatus from "@/components/status";
import { convertObjToParam, handleGetParam } from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import PopupEditMedia from "./popups/Edit";
import MySelectGroupV3 from "@/components/select-group/MySelectGroupItemV3";

interface ListRequestDepositProps {
  authorizedPermissions?: any;
}

const ListBank = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { getPaymentMethod } = apiPaymentMethodService();
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [flagSearch, setFlagSearch] = useState<boolean>(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_PAYMENT_METHOD,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
  });
  const [searchParams] = useSearchParams();
  const [keySearch, setKeySearch] = useState<KeySearchType>({
    status__eq: "",
  });
  const param_payload = useMemo(() => {
    return handleGetParam(searchParams);
  }, [searchParams]);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_PAYMENT_METHOD", param_payload, pathname],
    queryFn: () => getPaymentMethod(param_payload),
    keepPreviousData: true,
  });
  const [page, setPage] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 1,
  });

  useEffect(() => {
    refetch();
  }, [flagSearch]);

  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_PAYMENT_METHOD,
  ) => {
    setPopup((prev) => ({
      ...prev,
      remove: params,
      data: data,
      status: status,
    }));
  };
  const actions = {
    openEditConfirm: (
      key_popup: boolean,
      status: string,
      code_item: typeof INIT_PAYMENT_METHOD,
    ) => {
      togglePopup(key_popup, status, code_item);
    },
    openRemoveConfirm: (key_popup: boolean, code_item: string) => {
      togglePopupRemove(key_popup, code_item);
    },
  };
  const togglePopupRemove = (params: boolean, code: string) => {
    setPopupRemove((prev) => ({ ...prev, remove: params, code: code }));
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  };
  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    setPage((prev) => ({ ...prev, currentPage: pageNumber }));
    setFlagSearch(true);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    setPage((prev) => ({ ...prev, pageSize }));
    setFlagSearch(true);
  };
  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: page.currentPage,
      take: page.pageSize,
    });
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  const handleOnChangeSearch = (value?: string) => {
    if (value) {
      setKeySearch({ ...keySearch, name__like: value });
    } else {
      const { name__like, ...rest } = keySearch;
      const filteredRest: { [key: string]: string } = Object.keys(rest).reduce(
        (acc, key) => {
          acc[key] = String(rest[key]);
          return acc;
        },
        {} as { [key: string]: string },
      );
      setKeySearch(filteredRest);
    }
  };
  const handleOnChangeSearchStatus = (name: string, value?: string) => {
    setKeySearch({ ...keySearch, [name]: value });
    let filter = convertObjToParam(
      { ...keySearch, [name]: value },
      {
        page: page.currentPage,
        take: page.pageSize,
      },
    );
    let url = `${pathname}${filter}`;
    navigate(url);
  };
  return (
    <>
      <Stack
        spacing={2}
        width="100%"
      >
        <MySelectGroupV3
          p={2}
          handleChange={() => {}}
          name=""
          values={{}}
          label="Đăng ký sử dụng sản phẩm ngân hàng"
          list={[
            { id: 1, name: "content" },
            { id: 2, name: "content" },
            { id: 13, name: "content" },
          ]}
          render={() => (
            <Stack
              sx={{
                alignItems: "center",
                gap: "12px",
                border: `1.6px solid ${"#D0D5DD"}`,
                p: "24px 12px",
                borderRadius: "12px",
                flex: 1 / 4,
                minWidth: 264,
              }}
            >
              <Image
                src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                // alt={d?.name}
                style={{ borderRadius: 8, height: 56, width: 56 }}
              />
              <Typography.Text>Momo</Typography.Text>
            </Stack>
          )}
        />
        <MySelectGroupV3
          p={2}
          handleChange={() => {}}
          name=""
          values={{}}
          label="Đại lý thu hộ"
          list={[
            { id: 1, name: "content" },
            { id: 2, name: "content" },
            { id: 13, name: "content" },
          ]}
          render={() => (
            <Stack
              sx={{
                alignItems: "center",
                gap: "12px",
                border: `1.6px solid ${"#D0D5DD"}`,
                p: "24px 12px",
                borderRadius: "12px",
                flex: 1 / 4,
                minWidth: 264,
              }}
            >
              <Image
                src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                // alt={d?.name}
                style={{ borderRadius: 8, height: 56, width: 56 }}
              />
              <Typography.Text>Momo</Typography.Text>
            </Stack>
          )}
        />
        <MySelectGroupV3
          p={2}
          handleChange={() => {}}
          name=""
          values={{}}
          label="Khác"
          list={[
            { id: 1, name: "content" },
            { id: 2, name: "content" },
            { id: 13, name: "content" },
          ]}
          render={() => (
            <Stack
              sx={{
                alignItems: "center",
                gap: "12px",
                border: `1.6px solid ${"#D0D5DD"}`,
                p: "24px 12px",
                borderRadius: "12px",
                flex: 1 / 4,
                minWidth: 264,
              }}
            >
              <Image
                src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                // alt={d?.name}
                style={{ borderRadius: 8, height: 56, width: 56 }}
              />
              <Typography.Text>Momo</Typography.Text>
            </Stack>
          )}
        />
      </Stack>
      {popup.remove && (
        <PopupEditMedia
          // listItem={selectedRowKeys}
          status={popup.status}
          handleClose={() => setPopup((prev) => ({ ...prev, remove: false }))}
          refetch={refetch}
          data={popup.data}
        />
      )}

      <PopupConfirmRemove
        listItem={[popupRemove.code]}
        // listItem={selectedRowKeys}
        open={popupRemove.remove}
        handleClose={() =>
          setPopupRemove((prev) => ({ ...prev, remove: false }))
        }
        refetch={refetch}
        name_item={[popupRemove.code]}
      />
    </>
  );
};

export default ListBank;
