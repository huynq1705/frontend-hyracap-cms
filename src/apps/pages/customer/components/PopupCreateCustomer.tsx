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
import { useNavigate, useParams } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
// import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import MyTextField from "@/components/input-custom-v2/text-field";
import MySelect from "@/components/input-custom-v2/select";
import MyDatePicker from "@/components/input-custom-v2/calendar";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faClose } from "@fortawesome/free-solid-svg-icons";
// import palette from "@/theme/palette-common";
import apiAccountService from "@/api/Account.service";
import { OptionSelect, ResponseFromServerV1 } from "@/types/types";
// import { useQuery } from "@tanstack/react-query";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import apiCustomerService from "@/api/apiCustomer.service";
import { INIT_CUSTOMER } from "@/constants/init-state/customer";
import ActionsEditPage from "@/components/actions-edit-page";
import MyRadio from "@/components/input-custom-v2/radio";
import { GENDER } from "@/constants";
// import { validate } from "uuid";

const VALIDATE = {
  full_name: "Vui lòng nhập họ tên",
  email: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  contact_staff_id: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  staff_in_charge_id: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  customer_source_id: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

const KEY_REQUIRED = [
  "full_name",
  "email",
  "phone_number",
  "contact_staff_id",
  "staff_in_charge_id",
  "customer_source_id",
];

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
  // open: boolean;
  data: typeof INIT_CUSTOMER;
  status: string | "create";
}

function PopupCreateEmployee(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch, data, status } = props;

  const { postCustomer } = apiCustomerService();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const [statusPage, setStatusPage] = React.useState(status);
  const [formData, setFormData] = React.useState(INIT_CUSTOMER);
  const [errors, setErrors] = React.useState<string[]>([]);
  const { getAccount } = apiAccountService();
  const { code } = useParams();
  // const { detailCommon } = apiCommonService();
  const { getCustomerSource } = apiCustomerSourceService();

  // const [listRole, setListRole] = React.useState<OptionSelect>([
  //   { label: "Nam", value: "0" }, { label: "Nữ", value: "1" }, { label: "Khác", value: "2" },
  // ]);
  const [listAccount, setListAccount] = React.useState<OptionSelect>([]);
  const [listCustomerSource, setListCustomerSource] = React.useState<OptionSelect>([]);
  // const [editPassword, setEditPassword] = React.useState(true);
  // const [serviceCatalog, setServiceCatalog] = React.useState<OptionSelect>([]);
  // const [editPassword, setEditPassword] = React.useState(true);

  const isView = React.useMemo(() => {
    return statusPage.includes("view");
  }, [statusPage]);

  const fetchCustomerSource = async () => {
    try {
      const param = {
        page: 1,
         take: 999,
      };
      const response = await getCustomerSource(param);
      if (response) {
        setListCustomerSource(
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
  const fetchAccount = async () => {
    try {
      const param = {
        page: 1,
        take: 999,
        
      };
      const response = await getAccount(param);
      if (response) {
        setListAccount(
          response.data.map((it) => ({
            value: it.id.toString(),
            label: it.full_name,
          })),
        );
      }
    } catch (e) {
      throw e;
    }
  };
  React.useEffect(() => {
    fetchCustomerSource();
    fetchAccount();
  }, [code]);
  React.useEffect(() => {
    setStatusPage(status);
    // getPosition()
    setFormData(data);
    setErrors([]);
  }, []);

  React.useEffect(() => {
    if (data) {
    }
  }, [data]);
  const handleOnchange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmitCreate = async () => {
    // const payload = {};
    try {
      const response = await postCustomer(formData, KEY_REQUIRED,1);
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch && refetch();
          handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: "createSuccess",
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: "createError",
            }),
          );
          break;
        }
        default: {
          console.log('res', response);

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
          message: "createError",
        }),
      );
      console.error("==>", error);
    }
  };
  const handleSubmitUpdate = async () => {};

  const onClosePopup = handleClose;

  const handelSave = () => {
    if (isView) {
      setStatusPage("edit");
    } else {
      statusPage === "create" ? handleSubmitCreate() : handleSubmitUpdate();
    }
  };
  const handleRemove = () => {
    setStatusPage("edit");
  };
  const handleCancel = () => {
    handleClose();
  };
  const actions = React.useMemo(
    () => ({ handelSave, handleRemove, handleCancel }),
    [formData],
  );
  return (
    <>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        onClose={onClosePopup}
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
          ></DialogActions>
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
            {/* <h3 style={{ color: palette.textQuaternary }}>Thông tin chung</h3> */}
            <div className="wrapper-from">
              {statusPage !== 'create' &&
                <MyTextField
                  label="Mã khách hàng"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="id"
                  placeholder="Nhập"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={true}
                />
              }
              <MyTextField
                label="Họ và tên"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="full_name"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={isView}
              />
              {statusPage === 'create' &&
                <Stack
                  sx={{ width: 'calc(50%-12px' }}
                />
              }
              <MyRadio
                options={GENDER}
                label="Giới tính"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="gender"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={isView}
              />
              <MyDatePicker
                label={T("date_of_birth")}
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="date_of_birth"
                placeholder="Chọn"
                handleChange={handleOnchangeDate}
                values={formData}
                validate={VALIDATE}
                disabled={isView}
              />
              <MyTextField
                label={T("phone_number")}
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="phone_number"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={isView}
              />
              <MyTextField
                label="Email"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="email"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={isView}
              />
              <MySelect
                options={listAccount}
                label="Nhân viên liên hệ"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="contact_staff_id"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="select-one"
                itemsPerPage={5}
                disabled={isView}
              />
              <MySelect
                options={listAccount}
                label="Nhân viên phụ trách"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="staff_in_charge_id"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="select-one"
                itemsPerPage={5}
                disabled={isView}
              />
              <MySelect
                options={listCustomerSource}
                label="Nguồn khách hàng"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="customer_source_id"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="select-one"
                itemsPerPage={5}
                disabled={isView}
              />
              <MyTextField
                label="Ghi chú về khách hàng"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="note"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={isView}
              />
            </div>
          </Stack>
          <Stack pr={3} style={{ borderTop: "0.5px solid #D0D5DD" }}>
            <ActionsEditPage actions={actions} isView={isView} />
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupCreateEmployee);
