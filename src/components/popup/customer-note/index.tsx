import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import apiCustomerNoteService from "@/api/apiCustomerNote.service";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { INIT_CUSTOMER_NOTE } from "@/constants/init-state/customer_note";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { UploadFile } from "antd";
import ListImage from "@/components/list-image";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupCustomerNoteProps {
  open: boolean;
  onClose: () => void;
  customer_id: number;
  dataEdit: {
    note: string;
    id: number;
  };
}
function PopupCustomerNote(props: PopupCustomerNoteProps) {
  const { onClose, open, customer_id, dataEdit } = props;
  const { T } = useCustomTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const { submitCustomerNote } = apiCustomerNoteService();
  const [formData, setFormData] = React.useState(INIT_CUSTOMER_NOTE);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const handleOnchange = (e: any) => {
    if (!e?.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleClose = () => {
    onClose();
    setFormData(INIT_CUSTOMER_NOTE);
  };

  const handleSubmit = async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await submitCustomerNote(
        formData,
        ["note"],
        userInfo.id,
        customer_id,
        dataEdit.id ?? null,
        fileList,
      );
      if (response) {
        handleClose();
        setFormData(INIT_CUSTOMER_NOTE);
      }
      const action_name = dataEdit.id ? "Cập nhật" : "Thêm";
      dispatch(
        setGlobalNoti({
          type: response ? "success" : "error",
          message: response
            ? action_name + " ghi chú thành công"
            : action_name + " ghi chú thất bại",
        }),
      );
    } catch (e) {
      throw e;
    }
    setTimeout(() => {
      dispatch(setIsLoading(false));
    }, 200);
  };
  React.useEffect(() => {
    if (dataEdit.id) setFormData((prev) => ({ ...prev, note: dataEdit.note }));
  }, [dataEdit]);
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box className="popup-remove-wrapper min-w-[400px] max-sm:min-w-[calc(80vw)]">
          <Box
            className="w-full flex px-4 py-3 justify-between items-center"
            sx={{
              border: "1px solid var(--border-color-primary)",
            }}
          >
            <h3>{"Thêm ghi chú"}</h3>
            <ButtonCore
              type="secondary"
              title=""
              icon={<FontAwesomeIcon icon={faXmark} />}
              onClick={onClose}
            />
          </Box>
          <div className="w-full px-4">
            <ListImage
              fileList={fileList}
              length={5}
              setFileList={setFileList}
              disabled={!!dataEdit.id}
            />
            <MyTextareaAutosize
              label="Ghi chú"
              errors={[]}
              required={["note"]}
              configUI={{
                width: "100%",
                minRows: 4,
              }}
              name="note"
              placeholder="Nhập nội dung ghi chú, không quá 225 ký tự"
              handleChange={handleOnchange}
              values={formData}
              validate={{ note: "nhập nội dung" }}
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
export default React.memo(PopupCustomerNote);
