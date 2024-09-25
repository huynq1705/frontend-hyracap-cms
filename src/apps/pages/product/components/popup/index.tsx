import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import { INIT_PRODUCT_CATEGORY } from "@/constants/init-state/product_category";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupCreateProductCategoryProps {
  open: boolean;
  onClose: () => void;
}
const VALIDATE = {
  name: "Hãy nhập tên danh mục sản phẩm",
};
const KEY_REQUIRED = ["name"];
function PopupCreateProductCategory(props: PopupCreateProductCategoryProps) {
  const { onClose, open } = props;
  const { T } = useCustomTranslation();
  const dispatch = useDispatch();
  const [errors, setErrors] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState(INIT_PRODUCT_CATEGORY);
  const handleOnchange = (e: any) => {
    if (!e?.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleClose = () => {
    onClose();
    setFormData(INIT_PRODUCT_CATEGORY);
  };
  const { postProductCategory } = apiProductCategoryService();

  const handleSubmit = async () => {
    try {
      const response = await postProductCategory(formData, KEY_REQUIRED);
      if (typeof response === "object") {
        setErrors(response.missingKeys);
        dispatch(
          setGlobalNoti({
            type: "info",
            message: "Nhập đẩy đủ dữ liệu",
          }),
        );
        return;
      }
      dispatch(
        setGlobalNoti({
          type: response ? "success" : "error",
          message:
            `Tạo danh mục sản phẩm ` + (response ? "thành công" : "thất bại"),
        }),
      );
      if (response === true) handleClose();
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
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box className="popup-remove-wrapper min-w-[400px]">
          <Box
            className="w-full flex px-4 py-3 justify-between items-center"
            sx={{
              border: "1px solid var(--border-color-primary)",
            }}
          >
            <h3>{"Thêm danh mục sản phẩm"}</h3>
            <ButtonCore
              type="secondary"
              title=""
              icon={<FontAwesomeIcon icon={faXmark} />}
              onClick={onClose}
            />
          </Box>
          <div className="w-full px-4">
            {/* name */}
            <MyTextField
              label="Tên sản phẩm"
              errors={errors}
              required={KEY_REQUIRED}
              configUI={{}}
              name="name"
              placeholder="Danh mục sản phẩm"
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
export default React.memo(PopupCreateProductCategory);
