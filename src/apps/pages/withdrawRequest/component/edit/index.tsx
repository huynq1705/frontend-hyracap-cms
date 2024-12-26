import apiCommonService from "@/api/apiCommon.service";
import apiContractService from "@/api/apiContract.service";
import apiProductService from "@/api/apiProduct.service";
import apiTransactionService from "@/api/apiTransaction.service";
import apiWithdrawRequestService from "@/api/apiWithDrawRequest.service";
import ButtonCore from "@/components/button/core";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { setIsLoading } from "@/redux/slices/app.slice";
import { OptionSelect } from "@/types/types";
import { formatCurrencyNoUnit, getKeyPage } from "@/utils";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
interface EditPageProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}
interface FormData {
  amount: string;
  account_number: string;
  bank: string;
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
  const { getWithdrawRequest } = apiWithdrawRequestService();
  const [loading, setLoading] = useState(false);
  const getDetail = async () => {
    setLoading(true);
    if (!code) return;
    try {
      const param = {
        page: 1,
        take: 50,
        id__eq: code,
      };
      const response = await getWithdrawRequest(param);
      console.log("response", response.data);
      if (response) {
        setFormData({
          amount: response.data[0].amount.toString(),
          account_number: response.data[0].account_number,
          bank: response.data[0].bank_bin,
        });
        setLoading(false);
      }
    } catch (e) {
      throw e;
      setLoading(false);
    }
  };
  const handleCreate = async () => {
    // try {
    //     const response = await postTransaction(formData, KEY_REQUIRED);
    //     let message = `Tạo ${title_page} thất bại`;
    //     let type = "error";
    //     if (typeof response === "object" && response?.missingKeys) {
    //         setErrors(response.missingKeys);
    //         return;
    //     }
    //     if (response === true) {
    //         message = `Tạo ${title_page} thành công`;
    //         type = "success";
    //         handleCancel();
    //     }
    //     dispatch(
    //         setGlobalNoti({
    //             type,
    //             message,
    //         })
    //     );
    // } catch (error) {
    //     dispatch(
    //         setGlobalNoti({
    //             type: "error",
    //             message: "createError",
    //         })
    //     );
    // }
  };
  const handleCancel = () => {
    setFormData({
      amount: "",
      account_number: "",
      bank: "",
    });
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

    // if (!code) return;
    // try {
    //     const response = await putProduct(formData, code, KEY_REQUIRED);
    //     let message = `Cập nhật ${title_page} thất bại`;
    //     let type = "error";
    //     if (typeof response === "object" && response?.missingKeys) {
    //         setErrors(response.missingKeys);
    //         return;
    //     }
    //     if (response === true) {
    //         message = `Cập nhật ${title_page} thành công`;
    //         type = "success";
    //     }
    //     dispatch(
    //         setGlobalNoti({
    //             type,
    //             message,
    //         })
    //     );
    //     if (response === true) {
    //         handleCancel();
    //     }
    // } catch (error) {
    //     dispatch(
    //         setGlobalNoti({
    //             type: "error",
    //             message: "updateError",
    //         })
    //     );
    //     console.error(error);
    // }
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
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    account_number: "",
    bank: "",
  });
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
    console.log("formData", formData);
  }, [code, open]);
  return (
    <>
      <Box
        className="flex px-4 py-3 justify-between items-center sticky top-0 left-0 w-[101%] !bg-white z-[4]"
        sx={{
          border: "1px solid var(--border-color-primary)",
        }}
      >
        <h3>Chuyển tiền</h3>
        <ButtonCore
          type="secondary"
          title=""
          icon={
            <FontAwesomeIcon
              icon={faXmark}
              width={"16px"}
              height={16}
              color="#000"
            />
          }
          onClick={handleCancel}
        />
      </Box>
      <div className="wrapper-edit-page">
        <div className="flex flex-col justify-center items-center">
          <h3>Quét mã QR để chuyển khoản</h3>
          {/* <QRCodeCanvas
            value={`BANK:${formData.bank}|ACC:${formData.account_number}|AMT:${formData.amount}|MSG:Payment`}
            size={256}
            level="H"
            includeMargin={true}
          /> */}
          {loading ? (
            <div className="loading">
              <img
                className="w-84 h-60 mt-2 mb-2"
                src={`https://img.idesign.vn/2018/10/23/id-loading-1.gif`}
                alt=""
              />
            </div>
          ) : (
            <div>
              <img
                className="w-60 h-60 mt-2 mb-2"
                src={`https://api.vietqr.io/image/${formData.bank}-${formData.account_number}-yWjvOtH.jpg?accountName=HYRACAP&amount=${formData.amount}&addInfo=200`}
                alt=""
              />
            </div>
          )}

          <p>Số tài khoản: {formData.account_number} </p>
          <p>Số tiền: {formatCurrencyNoUnit(+formData.amount)} VND</p>
        </div>
      </div>
    </>
  );
}
