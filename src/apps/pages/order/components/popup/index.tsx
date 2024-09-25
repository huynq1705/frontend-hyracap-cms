import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import apiCustomerService from "@/api/apiCustomer.service";
import clsx from "clsx";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupCreateCustomerProps {
  open: boolean;
  onClose: () => void;
  handleCreateSuccess: (data: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
  }) => void;
  phone_number: string;
}
const VALIDATE = {
  full_name: "Hãy nhập tên khách hàng",
  phone_number: "Hãy nhập số điện thoại",
  email: "Hãy nhập email",
};
const KEY_REQUIRED = ["full_name", "phone_number", "email"];
const INIT_CUSTOMER = {
  full_name: "",
  email: "",
};
function PopupCreateCustomer(props: PopupCreateCustomerProps) {
  const { onClose, handleCreateSuccess, open, phone_number } = props;
  const { T } = useCustomTranslation();
  const dispatch = useDispatch();
  const [errors, setErrors] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState<any>({
    INIT_CUSTOMER,
  });
  const handleOnchange = (e: any) => {
    if (!e?.target) return;
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleClose = () => {
    onClose();
    setFormData(INIT_CUSTOMER);
  };
  const { postCustomerOrder } = apiCustomerService();

  const handleSubmit = async () => {
    formData.phone_number = phone_number;
    try {
      const response = await postCustomerOrder(formData, KEY_REQUIRED);
      if (response.isValidate) {
        setErrors(response.missingKeys);
        dispatch(
          setGlobalNoti({
            type: "info",
            message: "Nhập đẩy đủ dữ liệu",
          }),
        );
        return;
      }

      let message =
        `Tạo khách hàng ` + (!response.isValidate ? "thành công" : "thất bại");
      let type = !response.isValidate ? "success" : "error";
      if (
        response.statusCode === 409 &&
        response?.error[0]?.includes("email")
      ) {
        message = "Email này đã được đăng kí";
        type = "info";
      }
      if (
        response.statusCode === 409 &&
        response?.error[0]?.includes("phone_number")
      ) {
        message = "Số điện thoại này đã được đăng kí";
        type = "info";
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
      if (!response.isValidate && response.statusCode === 200) {
        const data = {
          id: response.id,
          email: formData.email,
          phone_number,
          full_name: formData.full_name,
        };
        handleCreateSuccess(data);
        handleClose();
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "createError",
        }),
      );
      console.error(error);
    }
  };
  const isMobile = window.innerWidth <= 768;
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth={!isMobile ? "xl" : "lg"}
        fullWidth={isMobile}
      >
        <Box
          className={clsx(
            "popup-remove-wrapper ",
            isMobile ? "w-full" : "min-w-[400px]",
          )}
        >
          <Box
            className="w-full flex px-4 py-3 justify-between items-center"
            sx={{
              border: "1px solid var(--border-color-primary)",
            }}
          >
            <h3>{"Thêm khách hàng"}</h3>
            <ButtonCore
              type="secondary"
              title=""
              icon={<FontAwesomeIcon icon={faXmark} />}
              onClick={onClose}
            />
          </Box>
          <div className="w-full px-4 flex flex-col gap-4">
            {/* name */}
            <MyTextField
              label="Số điện thoại"
              errors={errors}
              required={KEY_REQUIRED}
              configUI={{}}
              name="phone_number"
              placeholder="Số điện thoại"
              handleChange={handleOnchange}
              values={{ phone_number }}
              validate={VALIDATE}
              disabled={true}
            />
            {/* full_name */}
            <MyTextField
              label="Tên khách hàng"
              errors={errors}
              required={KEY_REQUIRED}
              configUI={{}}
              name="full_name"
              placeholder="Khách hàng"
              handleChange={handleOnchange}
              values={formData}
              validate={VALIDATE}
            />

            {/* name */}
            <MyTextField
              label="Email"
              errors={errors}
              required={KEY_REQUIRED}
              configUI={{}}
              name="email"
              placeholder="Email"
              handleChange={handleOnchange}
              values={formData}
              validate={VALIDATE}
            />
          </div>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"12px"}
            width={"100%"}
            sx={{
              padding: "12px 24px 24px",
            }}
          >
            <ButtonCore
              title={T("cancel")}
              type="bgWhite"
              styles={{
                width: "calc(50% - 6px)",
              }}
              onClick={handleClose}
            />

            <ButtonCore
              title={T("confirm")}
              styles={{
                width: "calc(50% - 6px)",
              }}
              onClick={handleSubmit}
            />
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupCreateCustomer);
