import { useQuery } from "@tanstack/react-query";
import { Typography, Table, PaginationProps, Pagination, Empty } from "antd";
import { useDispatch } from "react-redux";

import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiWithdrawAccountService from "@/api/apiWithdrawAccount.service";
import MyTextField from "@/components/input-custom-v2/text-field";
import { useEffect, useMemo, useState } from "react";
import { INIT_WITHDRAW_ACCOUNT } from "@/constants/init-state/withdraw_account";
import CustomAutocomplete from "@/components/input-custom-v2/select/index-autocomplete";
import { BankList } from "@/constants/bank/bank";
import { useLocation } from "react-router-dom";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";

// import BankCard from "./components/BankCard";

const VALIDATE = {
  bank: "Vui lòng chọn ngân hàng",
  account_number: "Vui lòng nhập số tài khoản",
  name_on_card: "Vui lòng nhập tên chủ tài khoản",
};
const KEY_REQUIRED = ["bank", "name_on_card", "account_number"];

interface BankPageProps {
  authorizedPermissions?: any;
}

function BankPage(props: BankPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INIT_WITHDRAW_ACCOUNT);
  const [errors, setErrors] = useState<string[]>([]);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const { getWithdrawAccount, getHyraBank, putWithdrawAccount } =
    apiWithdrawAccountService();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["hyraBank"],
    queryFn: () => getHyraBank(),
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...(data?.data || {}),
      }));
    }
  }, [data, refetch]);

  const handleOnchange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isEdit = useMemo(() => {
    console.log(pathname);

    return pathname.includes("edit");
  }, [pathname]);
  console.log(isEdit);

  const convertBankList = useMemo(() => {
    return BankList.map((item) => ({
      value: item.shortName,
      label: item.name,
    }));
  }, []);

  const handleFindName = (value: string, label: string) => {
    const accountMatch = BankList.find(
      (c) => c.name === value || c.code === value || c.shortName === value
    );

    if (accountMatch) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bank: accountMatch.shortName,
        bank_bin: accountMatch.bin,
        bank_code: accountMatch.code,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bank: value,
      }));
    }
  };

  const handleCancel = () => {
    refetch();
    setFormData({
      ...(data?.data || {}),
    });
    navigate("/admin/bank");
  };

  const handleUpdate = async () => {
    try {
      const response = await putWithdrawAccount(
        data?.data?.id,
        formData,
        KEY_REQUIRED
      );
      let message = `Cập nhật thất bại`;
      let type = "error";
      console.log("response", response);
      if (typeof response === "object" && response?.missingKeys) {
        setErrors(response.missingKeys);
        return;
      }
      if (response === true) {
        message = `Cập nhật thành công`;
        type = "success";
        handleCancel();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        })
      );
      setErrors([]);
      refetch();
      navigate("/admin/bank");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box className="p-4">
      <Box width="100%" className="custom-table-wrapper" gap={3}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography.Title level={4}>Thông tin ngân hàng</Typography.Title>
          {isEdit ? (
            <Stack direction="row" spacing={2}>
              <ButtonCore
                title="Hủy"
                type="bgWhite"
                styles={{ width: "81px" }}
                onClick={handleCancel}
              />
              <ButtonCore
                title="Lưu"
                styles={{ width: "81px" }}
                onClick={handleUpdate}
              />
            </Stack>
          ) : (
            <ButtonCore
              title="Chỉnh sửa"
              styles={{ width: "fit-content" }}
              onClick={() => {
                navigate("/admin/bank/edit/1");
              }}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          <CustomAutocomplete
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Tên ngân hàng"
            name="bank"
            handleChange={handleFindName}
            values={formData}
            options={convertBankList}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5}
            disabled={true}
            placeholder="Chọn ngân hàng"
          />
          <MyTextField
            label="Số tài khoản"
            name="account_number"
            handleChange={handleOnchange}
            values={formData}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            disabled={!isEdit}
            placeholder="Nhập số tài khoản"
            configUI={{
              width: "calc(50% - 12px)",
            }}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <MyTextField
            label="Tên chủ tài khoản"
            name="name_on_card"
            handleChange={handleOnchange}
            values={formData}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            disabled={!isEdit}
            placeholder="Nhập tên chủ tài khoản"
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default BankPage;
