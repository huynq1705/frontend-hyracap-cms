import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import CurrencyInput from "@/components/input-custom-v2/currency";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import { INIT_REPORT } from "@/constants/init-state/report";
import apiReportService from "@/api/report.service";
import { ResponseReportItem } from "@/types/report";
import MySelect from "@/components/input-custom-v2/select";
import UploadImage from "@/apps/pages/blog/components/UploadImg";
import { Stack } from "@mui/material";
import { Typography } from "antd";
import UploadFile from "@/apps/pages/project/components/UploadFile";
import PDFPreview from "@/components/previewPDF";
import PreviewMultiFile from "@/components/previewMultiFile";
import apiFaqService from "@/api/apiFaq.service";
import { ResponseFaqItem } from "@/types/faq";
import { INIT_FAQ } from "@/constants/init-state/faq";

const VALIDATE = {
  question: "Hãy nhập câu hỏi",
  answer: "Hãy nhập câu trả lời",
};
const KEY_REQUIRED = ["question", "answer"];
interface EditPageProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}
const type = [
  { value: "0", label: "Báo cáo tài chính" },
  { value: "1", label: "Báo cáo dự án" },
  { value: "2", label: "Báo cáo xã hội" },
  { value: "3", label: "Báo cáo khác" },
];
export default function EditPage(props: EditPageProps) {
  //--init
  const { onClose, refetch, open } = props;
  //--const
  const { code } = useParams();
  const { pathname } = useLocation();
  //--state
  const [typeOption, setTypeOption] = useState<OptionSelect>(type);
  const [errors, setErrors] = useState<string[]>([]);
  const [checkFile, setCheckFile] = useState(false);
  const [formData, setFormData] = useState(INIT_FAQ);
  const [popup, setPopup] = useState({
    remove: false,
    loading: true,
  });
  //--fn
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const { detailCommon } = apiCommonService();
  const { postReport, putReport } = apiReportService();
  const { getFaqById, putFaq, postFaq } = apiFaqService();
  const title_page = T(getKeyPage(pathname, "key"));

  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<ResponseFaqItem>(code, "/faq");
      if (response) {
        const convert_data = {
          question: response.question,
          answer: response.answer,
        };
        setFormData(convert_data);
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "Failed to fetch product details",
        })
      );
    }
  };

  const handleCreate = async () => {
    try {
      const response = await postFaq(formData, KEY_REQUIRED);
      let message = `Tạo ${title_page} thất bại`;
      let type = "error";
      if (typeof response === "object" && response?.missingKeys) {
        setErrors(response.missingKeys);
        return;
      }
      if (response === true) {
        message = `Tạo ${title_page} thành công`;
        type = "success";
        setCheckFile(false);
        handleCancel();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        })
      );
    } catch (error) {
      setCheckFile(true);
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "Tạo thất bại",
        })
      );
    }
  };
  const handleCancel = () => {
    setFormData(INIT_FAQ);
    navigate("/admin/faq");
    onClose();
  };
  const handelSave = async () => {
    if (isView) {
      navigate(`/admin/faq/edit/${code}`);
    } else {
      console.log("formData", formData);
      // dispatch(setIsLoading(true));
      await (code ? handleUpdate() : handleCreate());
      // setFormData(INIT_REPORT);
      refetch();
    }
    setTimeout(() => {
      dispatch(setIsLoading(false));
    }, 200);
  };
  const handleUpdate = async () => {
    console.log("formDatas", formData, code);

    if (!code) return;
    try {
      const response = await putFaq(formData, +code, KEY_REQUIRED);
      console.log("response", response);
      let message = `Cập nhật ${title_page} thất bại`;
      let type = "error";
      if (typeof response === "object" && response?.missingKeys) {
        setErrors(response.missingKeys);
        return;
      }
      if (response === true) {
        message = `Cập nhật ${title_page} thành công`;
        type = "success";
        setCheckFile(false);
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
      setCheckFile(true);
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
  const handleChangeImage = (field: string) => (value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const togglePopup = useCallback((params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  }, []);

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
    }
  }, [code, open]);
  return (
    <>
      <HeaderModalEdit onClose={handleCancel} />
      <div className="wrapper-edit-page">
        <div className="flex flex-col gap-5">
          {/* name */}
          <MyTextField
            label="Câu hỏi"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(100% - 12px)",
            }}
            name="question"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
          />
          <MyTextField
            label="Câu trả lời"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(100% - 12px)",
            }}
            name="answer"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
          />
        </div>
      </div>
      <ActionsEditPage actions={actions} isView={isView} />
    </>
  );
}
