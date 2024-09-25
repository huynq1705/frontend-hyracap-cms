import { Box, Dialog, DialogActions, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import MyTextField from "@/components/input-custom-v2/text-field";
import CSwitch from "@/components/custom/CSwitch";
import MySelect from "@/components/input-custom-v2/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import { INIT_SERVICE } from "@/constants/init-state/service";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import { OptionSelect } from "@/types/types";
import MyTextFieldCurrency from "@/components/input-custom-v2/currency/TextCurrency";
import { UploadFile } from "antd";
import ListImageV2 from "@/components/list-image/ListImageV2";


const VALIDATE = {
  price: "Vui lòng nhập giá dịch vụ.",
  name: "Vui lòng nhập tên dịch vụ.",
  time: "Vui lòng nhập thời lượng dịch vụ",
  // lick_video : "Không đúng định dạng."
};
const KEY_REQUIRED = ["name", "price", "time"];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupConfirmRemoveProps {
  refetch?: () => void;
  handleClose: () => void;
  data: typeof INIT_SERVICE;
  status: string | "create";
}

function PopupEditService(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch, data, status } = props;
  const API_URL = import.meta.env.VITE_APP_URL_IMG;
  const { postService, putService, getServiceCatalog } =
    apiServiceSpaServicerService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const [statusPage, setStatusPage] = React.useState(status);
  const [formData, setFormData] = React.useState(data);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [isApi, setIsApi] = React.useState(false)
  const [serviceCatalog, setServiceCatalog] = React.useState<OptionSelect>([]);
  const getAllServiceCatalog = async () => {
    try {
      const param = {
        page: 1,
        take: 999,
      };
      const response = await getServiceCatalog(param);
      if (response.data) {
        setServiceCatalog(
          response.data.map((it) => ({
            value: it.id.toString(),
            label: it.name,
          })),
        );
      }
    } catch (e) {
      throw e;
    }
  };

  React.useEffect(() => {
    getAllServiceCatalog();
    setFileList(
      data?.link_img?.map((item, index) => ({
        uid: (index + 1).toString(),
        name: item,
        status: 'done',
        url: API_URL + item,
      })) || []
    )
  }, []);

  React.useEffect(() => {
    formData.status === 0 &&
      setFormData({
        ...formData,
        is_book_online: 0
      })
  }, [formData.status]);



  
  const onChangeCommission = (name: string, value: any) => {
    if (name === "commission_percentage") {
      setFormData({
        ...formData,
        commission_percentage: value.replace(/^0+/, '') || 0,
        commission: formData.price * (parseFloat(value || 0) / 100)
      })
    }
    if (name === "commission") {
      let pv = parseFloat(value) >= parseFloat(formData.price.toString()) ? formData.price : value
      setFormData({
        ...formData,
        commission: pv,
        commission_percentage: parseFloat((parseFloat(pv) / formData.price).toFixed(2)) * 100
      })
    }
  }
  const onChangePrice = (name: string, value: any) =>{
      setFormData({
        ...formData,
        [name] : value,
        commission: value * (parseFloat(formData?.commission_percentage?.toString() || "0") / 100) 
      })
  }
  const handleOnchange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCreate = async () => {
    setIsApi(true)

    try {
      const response = await postService(formData, KEY_REQUIRED, fileList);
      let message = "Tạo dịch vụ thất bại";
      let type = "error";
      if (response?.isValid === false) {
        setErrors(response.missingKeys);
        return;
      }
      if (response.statusCode === 409) {
        setErrors(["name"]);
        VALIDATE.name = "Tên dịch vụ đã tồn tại";
        message = "Tên dịch vụ đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
        message = "Tạo dịch vụ thành công";
        type = "success";
        refetch && refetch();
        handleClose();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: T("thereWasError"),
        }),
      );
    } finally {
      setIsApi(false)
    }
  };
  const handleSubmitUpdate = async () => {
    setIsApi(true)
    
    try {
      const response = await putService(formData, KEY_REQUIRED, fileList);
      let message = "Cập nhật dịch vụ thất bại";
      let type = "error";
      if (response?.isValid === false) {
        setErrors(response.missingKeys);
        return;
      }
      if (response.statusCode === 409) {
        setErrors(["name"]);
        VALIDATE.name = "Tên dịch vụ đã tồn tại";
        message = "Tên dịch vụ đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
        message = "Cập nhật dịch vụ thành công";
        type = "success";
        refetch && refetch();
        handleClose();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: T("thereWasError"),
        }),
      );
    } finally {
      setIsApi(false)
    }
  };
  const handleOnchangeDate = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = () => {
    statusPage === "create" ? handleSubmitCreate() : handleSubmitUpdate();
    // handleUpload()
  };

  return (
    <>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ sx: { borderRadius: 2.5 } }}
        sx={{ zIndex: 100 }}
      >
        <Box>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              p: 2,
              borderBottom: "0.5px solid #D0D5DD",
            }}
          >
            <h2 style={{ fontSize: 20, color: palette.textQuaternary }}>
              {T(statusPage) + " " + t("service")}
            </h2>
            <button
              onClick={handleClose}
              style={{ border: "none", backgroundColor: "white" }}
            >
              <FontAwesomeIcon
                icon={faClose}
                style={{ width: 28, height: 28 }}
              />
            </button>
          </DialogActions>
          <Stack
            spacing={3}
            sx={{
              overflowY: "auto",
              scrollbarWidth: "thin",
              maxHeight: "70vh",
              p: 3,
              width: "100%",
            }}
          >
            <div className="wrapper-from">
              {/* <MyTextField
                label="Mã dịch vụ"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="id"
                placeholder="mitu code"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={true}
              /> */}

              <MyTextField
                label="Tên dịch vụ"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="name"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
              />
              <Stack
                direction={"column"}
                spacing={1.5}
                alignItems={"flex-start"}
                sx={{
                  width: "calc(50% - 12px)",
                  height: "fit-content",
                }}
              >
                <label className="label">{"Trạng thái"} </label>
                <Box height={32}>
                  <CSwitch
                    disabled={statusPage === "detail"}
                    checked={formData.status === 1}
                    value={formData.status}
                    name="status"
                    onChange={(e) => {
                      handleOnchangeDate(
                        e.target.name,
                        formData.status === 1 ? 0 : 1,
                      );
                    }}
                  />
                </Box>
              </Stack>

              <MySelect
                options={serviceCatalog}
                label="Danh mục dịch vụ"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="service_catalog_id"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="select-one"
                itemsPerPage={5}
                disabled={statusPage === "detail"}
              />
              <MyTextFieldCurrency
                label="Thời lượng"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="time"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
                type="number"
                unit="phút"
              />
              <MyTextFieldCurrency
                label="Số tiền dịch vụ"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="price"
                placeholder="Nhập"
                handleChange={(e) => onChangePrice(e.target.name, e.target.value)}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
                unit="VND"
                type="current"
              />
              <Stack
                direction={"column"}
                spacing={1.5}
                alignItems={"flex-start"}
                sx={{
                  width: "calc(50% - 12px)",
                  height: "fit-content",
                }}
              >
                <label className="label">{"Đặt trực tuyến"} </label>
                <Box height={32}>
                  <CSwitch
                    disabled={statusPage === "detail" || formData.status === 0}
                    checked={formData.is_book_online === 1}
                    value={formData.is_book_online}
                    name="is_book_online"
                    onChange={(e) => {
                      handleOnchangeDate(
                        e.target.name,
                        formData.is_book_online === 1 ? 0 : 1,
                      );
                    }}
                  />
                </Box>
              </Stack>
              <MyTextFieldCurrency
                label="Hoa hồng"
                errors={errors}
                required={KEY_REQUIRED}
                // name="price"
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="commission_percentage"
                placeholder="Nhập"
                handleChange={(e) => onChangeCommission(e.target.name, e.target.value)}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
                unit="%"
                type="number"
              />
              <MyTextFieldCurrency
                label=" "
                errors={errors}
                required={KEY_REQUIRED}
                // name="price"
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="commission"
                placeholder="Nhập"
                handleChange={(e) => onChangeCommission(e.target.name, e.target.value)}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
                unit="VND"
                type="current"
              />

              <MyTextareaAutosize
                label="Mô tả"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "100%",
                }}
                name="description"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
              />
              <MyTextField
                label="Link video"
                errors={errors}
                required={[]}
                name="link_video"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
              />
              <ListImageV2
                fileList={fileList}
                disabled={statusPage === "detail"}
                setFileList={setFileList}
                data={formData.link_img}
                name="link_img"
                length={5}
                onChange={handleOnchangeDate}
              />
            </div>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            width={"100%"}
            p={3}
            pt={1.5}
            spacing={2}
            style={{ borderTop: "0.5px solid #D0D5DD" }}
          >
            {statusPage !== "detail" ? (
              <ButtonCore
                title={T("cancel")}
                type="bgWhite"
                onClick={handleClose}
              />
            ) : (
              <ButtonCore
                type="bgWhite"
                title="Chỉnh sửa"
                onClick={() => setStatusPage("edit")}
              />
            )}
            {statusPage === "detail" ? (
              <ButtonCore title={"Đóng"} onClick={handleClose} />
            ) : (
              <ButtonCore title={"Hoàn tất"} onClick={handleSubmit} loading={isApi}/>
            )}
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupEditService);
