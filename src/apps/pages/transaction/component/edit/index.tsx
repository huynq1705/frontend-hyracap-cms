import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiProductService from "@/api/apiProduct.service";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { ResponseProductItem } from "@/types/product";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import MySelect from "@/components/input-custom-v2/select";
import CurrencyInput from "@/components/input-custom-v2/currency";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import { OptionSelect } from "@/types/types";
import MySwitch from "@/components/input-custom-v2/switch";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ListImage from "@/components/list-image";
import { UploadFile } from "antd";
import { v4 as uuidv4 } from "uuid";
import CustomCurrencyInput from "@/components/input-custom-v2/currency";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import dayjs from "dayjs";
import apiTransactionService from "@/api/apiTransaction.service";
import apiContractService from "@/api/apiContract.service";
import { INIT_TRANSACTION } from "@/constants/init-state/transaction";
const VALIDATE = {
  amount: "Hãy nhập số tiền",
  code: "Nhập mã giao dịch",
  contract_id: "Chọn hợp đồng",
};
const KEY_REQUIRED = ["amount", "contract_id", "code"];
const OptionTypeSelect = [
  {
    value: "0",
    label: "Nạp tiền",
  },
  {
    value: "1",
    label: "Rút tiền",
  },
];
interface EditPageProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}
export default function EditPage(props: EditPageProps) {
  //--init
  const { onClose, refetch, open } = props;
  //--fn
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { T, t } = useCustomTranslation();
  const { detailCommon } = apiCommonService();
  const { postProduct, putProduct } = apiProductService();
  const { postTransaction } = apiTransactionService();
  const { getContract } = apiContractService();

  const getAllContract = async () => {
    try {
      const param = {
        page: 1,
        take: 10,
      };
      const response = await getContract(param);
      if (response) {
        setProductCategory(
          response.data.map((it: any) => ({
            value: it.id.toString(),
            label: `Hợp đồng mã số: ${it.contract_id}`,
          }))
        );
      }
    } catch (e) {
      throw e;
    }
  };
  const getDetail = async () => {
    if (!code) return;
    // try {
    //     const response = await detailCommon<ResponseProductItem>(
    //         code,
    //         "/products"
    //     );
    //     if (response) {
    //         const convert_data = {
    //             id: response.id,
    //             name: response.name,
    //             min_invest: response.min_invest.toString(),
    //             max_invest: response.max_invest.toString(),
    //             min_duration: response.min_duration.toString(),
    //             max_duration: response.max_duration.toString(),
    //             interest_rate: (
    //                 response.current_interest_rate * 100
    //             ).toString(),
    //             category_id: response.category_id,
    //             effective_from: dayjs().format("DD-MM-YYYY"),
    //         };
    //         setFormData(convert_data);
    //     }
    // } catch (error) {
    //     dispatch(
    //         setGlobalNoti({
    //             type: "error",
    //             message: "Failed to fetch product details",
    //         })
    //     );
    // }
  };
  const handleCreate = async () => {
    try {
      const response = await postTransaction(formData, KEY_REQUIRED);
      let message = `Tạo ${title_page} thất bại`;
      let type = "error";
      if (typeof response === "object" && response?.missingKeys) {
        setErrors(response.missingKeys);
        return;
      }
      if (response === true) {
        message = `Tạo ${title_page} thành công`;
        type = "success";
        handleCancel();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        })
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "createError",
        })
      );
    }
  };
  const handleCancel = () => {
    setFormData(INIT_TRANSACTION);
    navigate("/admin/transaction");
    onClose();
  };
  const handelSave = async () => {
    if (isView) {
      navigate(`/admin/transaction/edit/${code}`);
    } else {
      // dispatch(setIsLoading(true));
      await (code ? handleUpdate() : handleCreate());
      // setFormData(INIT_TRANSACTION);
      refetch();
    }
    setTimeout(() => {
      dispatch(setIsLoading(false));
    }, 200);
  };
  const handleUpdate = async () => {
    console.log("formData", formData);

    if (!code) return;
    try {
      const response = await putProduct(formData, code, KEY_REQUIRED);
      let message = `Cập nhật ${title_page} thất bại`;
      let type = "error";
      if (typeof response === "object" && response?.missingKeys) {
        setErrors(response.missingKeys);
        return;
      }
      if (response === true) {
        message = `Cập nhật ${title_page} thành công`;
        type = "success";
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        })
      );
      if (response === true) {
        handleCancel();
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "updateError",
        })
      );
      console.error(error);
    }
  };
  const handleRemove = useCallback(() => {
    togglePopup("remove");
  }, []);
  const handleOnchange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOnchangeCurrency = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const togglePopup = useCallback((params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  }, []);
  //--const
  const { code } = useParams();
  const { pathname } = useLocation();
  const title_page = T(getKeyPage(pathname, "key"));
  //--state
  const [productCategory, setProductCategory] = useState<OptionSelect>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState(INIT_TRANSACTION);
  const [popup, setPopup] = useState({
    remove: false,
    loading: true,
  });
  const isView = useMemo(() => {
    return pathname.includes("view");
  }, [pathname]);
  const actions = useMemo(
    () => ({ handelSave, handleRemove, handleCancel }),
    [formData]
  );
  //--effect
  useEffect(() => {
    code && getDetail();
    if (open) {
      getAllContract();
    }
  }, [code, open]);
  return (
    <>
      <HeaderModalEdit onClose={handleCancel} />
      <div className="wrapper-edit-page">
        <div className="wrapper-from items-end">
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Loại giao dịch"
            name="type"
            handleChange={handleOnchange}
            values={formData}
            options={OptionTypeSelect}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
            disabled={isView}
            placeholder="Chọn"
          />
          {/* name */}
          <MyTextField
            label="Mã giao dịch"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="code"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
          />
          {/* amount */}
          <CurrencyInput
            label="Số tiền"
            name="amount"
            handleChange={handleOnchangeCurrency}
            values={formData}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            configUI={{ width: "calc(50% - 12px)" }}
            disabled={isView}
          />
          {/* product_category_id */}
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Hợp đồng"
            name="contract_id"
            handleChange={handleOnchange}
            values={formData}
            options={productCategory}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
            disabled={isView}
            placeholder="Chọn"
          />
        </div>
      </div>
      <ActionsEditPage actions={actions} isView={isView} />
    </>
  );
}
