import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import MyTextField from "@/components/input-custom-v2/text-field";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import apiAccountService from "@/api/Account.service";
import { OptionSelect } from "@/types/types";
import MyTextFieldPassword from "@/components/input-custom-v2/password";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import MyRadio from "@/components/input-custom-v2/radio";
import MyTextFieldCurrency from "@/components/input-custom-v2/currency/TextCurrency";
import { Typography } from "antd";
import {
  PayLoadStaffSalary,
  ResponseStaffSalaryItem,
} from "@/types/StaffSalary";
import { INIT_STAFF_SALARY } from "@/constants/init-state/staffSalary";
import apiCommissionsService from "@/api/apiCommissions";
import apiStaffSalaryService from "@/api/apiStaffSalary";
import { formatCurrencyNoUnit } from "@/utils";

const VALIDATE = {
  month: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  quanity: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  money_per_quantity: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  total_salary: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

const KEY_REQUIRED = ["month", "quanity", "money_per_quantity", "total_salary"];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupConfirmRemoveProps {
  handleClose: () => void;
  // open: boolean;
  data: PayLoadStaffSalary;
  refetch: VoidFunction;
}

const listTitleQuantity = [
  "Số giờ làm việc",
  "Số ngày làm công chuẩn",
  "Số ca làm việc",
];
const listTitleMoney_per_quantity = [
  "Số tiền mỗi giờ",
  "Số ngày làm công thực tế",
  "Số tiền mỗi ca",
];
function PopupEditSalary(props: PopupConfirmRemoveProps) {
  const { handleClose, data, refetch } = props;
  const { postStaffSalary } = apiStaffSalaryService();
  const { getTotalCommissions } = apiCommissionsService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const [formData, setFormData] = React.useState<PayLoadStaffSalary>(data);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const getTotal = async (month: string) => {
    try {
      const response = await getTotalCommissions(data.staff_id, month);
      setFormData({ ...formData, total_commission: response.data || 0 });
    } catch (e) {
      throw e;
    }
  };

  React.useEffect(() => {
    if (formData.id === 0 && formData.month) {
      getTotal(formData.month);
    }
  }, [formData.month]);

  const handleOnchange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    setFormData({
      ...formData,
      total_salary:
        formData.allowance +
        formData.money_per_quantity * formData.quanity +
        formData.total_commission -
        formData.fine,
    });
  }, [formData]);

  const handleSubmitPass = async () => {
    setIsLoading(true);
    try {
      const { id, ...res } = formData;
      const response = await postStaffSalary(res, KEY_REQUIRED);
      switch (response) {
        case true: {
          // navigate("/customer");

          refetch();
          handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: "updateSuccess",
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: "updateError",
            }),
          );
          break;
        }
        default: {
          console.log(response);

          if (typeof response === "object") {
            setErrors(response.missingKeys);
            dispatch(
              setGlobalNoti({
                type: "info",
                message: "Nhập đẩy đủ dữ liệu",
              }),
            );
          }
        }
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "updateError",
        }),
      );
      console.error("==>", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
        // hidden
        // scroll="paper"
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ sx: { borderRadius: 2.5 } }}
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
              Tính tiền lương
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
            spacing={2}
            sx={{
              overflowY: "auto",
              scrollbarWidth: "thin",
              maxHeight: "70vh",
              p: 3,
              width: "100%",
            }}
          >
            <div className="wrapper-from">
              <MyDatePicker
                label={"Lương tháng"}
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="month"
                placeholder="Chọn"
                values={formData}
                handleChange={handleOnchangeDate}
                validate={VALIDATE}
                formatInput="YYYY-MM-DD"
                picker="month"
                formatCalendar="MM/YYYY"
                disabled={formData.id}
              />
              {/* <MyRadio
                handleChange={(e) => handleOnchangeDate("type", e.target.value)}
                name="type"
                options={[
                  { label: "Số giờ làm việc", value: "0" },
                  { value: "1", label: "Số ngày làm việc" },
                ]}
                values={formData}
                label="Tính theo"
                errors={[]}
                validate={{}}
                direction="column"
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                disabled={formData.id}
              /> */}
              <MyTextField
                label={listTitleQuantity[formData.type]}
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="quanity"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={formData.id}
                type="number"
              />
              <MyTextFieldCurrency
                label={listTitleMoney_per_quantity[formData.type]}
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="money_per_quantity"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="current"
                unit="VND"
                disabled={formData.id}
              />
              <MyTextFieldCurrency
                label="Hoa hồng"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="total_commission"
                placeholder="Nhập"
                handleChange={() => {}}
                values={formData}
                validate={VALIDATE}
                type="current"
                unit="VND"
                disabled
              />
              <MyTextFieldCurrency
                label="Phụ cấp"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="allowance"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="current"
                unit="VND"
                disabled={formData.id}
              />
              <MyTextFieldCurrency
                label="Tiền phạt"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="fine"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="current"
                unit="VND"
                disabled={formData.id}
              />
            </div>
            <Stack
              borderTop={1}
              borderColor={"#D0D5DD"}
              py={2}
              spacing={2}
              alignItems={"flex-end"}
              justifyContent={"flex-end"}
              flexDirection={"column"}
            >
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"calc(50% - 12px)"}
              >
                <label className="label">Tổng cộng</label>
                <Typography.Text
                  style={{
                    fontSize: "16px",
                    color: "#50945D",
                    fontWeight: "600",
                  }}
                >
                  {formatCurrencyNoUnit(formData.total_salary)} vnđ
                </Typography.Text>
              </Stack>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"calc(50% - 12px)"}
              >
                <label className="label">Tiền lương</label>
                <Typography.Text
                  style={{
                    fontSize: "14px",
                    color: palette.textQuaternary,
                    fontWeight: "600",
                  }}
                >
                  {formatCurrencyNoUnit(
                    formData.money_per_quantity * formData.quanity,
                  )}{" "}
                  vnđ
                </Typography.Text>
              </Stack>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"calc(50% - 12px)"}
              >
                <label className="label">Hoa hồng</label>
                <Typography.Text
                  style={{
                    fontSize: "14px",
                    color: palette.textQuaternary,
                    fontWeight: "600",
                  }}
                >
                  {formatCurrencyNoUnit(formData.total_commission)} vnđ
                </Typography.Text>
              </Stack>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"calc(50% - 12px)"}
              >
                <label className="label">Phụ cấp</label>
                <Typography.Text
                  style={{
                    fontSize: "14px",
                    color: palette.textQuaternary,
                    fontWeight: "600",
                  }}
                >
                  {formatCurrencyNoUnit(formData.allowance)} vnđ
                </Typography.Text>
              </Stack>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"calc(50% - 12px)"}
              >
                <label className="label">Tiền phạt</label>
                <Typography.Text
                  style={{
                    fontSize: "14px",
                    color: palette.textQuaternary,
                    fontWeight: "600",
                  }}
                >
                  -{formatCurrencyNoUnit(formData.fine)} vnđ
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>

          {formData?.id === 0 && (
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
              <ButtonCore
                title={T("cancel")}
                type="bgWhite"
                onClick={handleClose}
              />

              <ButtonCore
                title={"Hoàn tất"}
                onClick={handleSubmitPass}
                loading={isLoading}
              />
            </Stack>
          )}
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupEditSalary);
