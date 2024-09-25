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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import MyTextField from "@/components/input-custom-v2/text-field";
import CSwitch from "@/components/custom/CSwitch";
// import  { bgPrimary, palette.textQuaternary  } from "@/theme/palette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import MySelectGroupV2 from "@/components/select-group/MySelectGroupV2";
import apiRoleService from "@/api/apiRole.service";
import apiAccountService from "@/api/Account.service";
import { PayloadRoleGroup } from "@/types/role";
import { Init_Role_Detail, INIT_ROLE_DETAIL } from "@/constants/init-state/role";

const VALIDATE = {
  name: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

const KEY_REQUIRED = [
  "name"
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
  refetch: () => void;
  handleClose: () => void;
}

interface Option {
  key: string;
  value: string;
  content: string
}
function PopupEdit(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch } = props;
  const { pathname } = useLocation();
  const { code } = useParams();
  const { getRoleDetail, putRole, postRole } = apiRoleService();
  const { getAccount } = apiAccountService();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const [statusPage, setStatusPage] = React.useState(pathname.split("/")[3]);
  const [formData, setFormData] = React.useState<Init_Role_Detail>(INIT_ROLE_DETAIL);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [availableOptions, setOptions] = React.useState([
    { key: "1", value: "Làm sạch sâu", content: "you" },
    { key: "2", value: "Trị sẹo bằng laze", content: "we" },
    { key: "3", value: "Chăm sóc phục hồi", content: "no" },
  ]);
  const [isApi, setIsApi] = React.useState(false)
  const getDetail = async () => {
    try {

      const response = await getRoleDetail(code);
      if (response.data) {
        setFormData({
          ...response.data,
          account: response.data?.account
            ?.filter((item: any) => item.is_active === true)
            .map((item: any) => ({
              key: item.id.toString(),
              value: item.full_name,
              content: item.position
            })) || []
        });
      }
    } catch (e) {
      throw e;
    }
  };
  const getListAccount = async () => {
    try {
      const param = {
        page: 1,
        take: 999,
      };
      const response = await getAccount(param);
      if (response.data) {
        const convert = response.data?.map((item) => ({
          key: item.id.toString(),
          value: item.full_name,
          content: item.position
        })) || []
        setOptions(convert);
      }
    } catch (e) {
      throw e;
    }
  };

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
    try {
      const covertData: PayloadRoleGroup = {
        account_id: formData.account.map(item => parseInt(item.key, 10)) || [],
        name: formData.name,
        note: formData.note,
        permission_id: [],
        status: formData.status
      }
      const response = await postRole(covertData, KEY_REQUIRED)
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch()
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("create") + " " + t("role-account") + " " + t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("create") + " " + t("role-account") + " " + t("fail"),
            }),
          );
          break;
        }
        default: {
          if (typeof response === "object") {
            setErrors(response.missingKeys);
            if (response.isValid) {
              setErrors(response.missingKeys)
              VALIDATE.name = "Tên nhóm đã tồn tại."
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Tên nhóm đã tồn tại.",
                }),
              );
            } else {
              setErrors(response.missingKeys)
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Nhập đẩy đủ dữ liệu",
                }),
              );
            }
          }
        }
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: T("thereWasError"),
        }),
      );
      console.error("==>", error);
    }
  };
  const handleSubmitUpdate = async () => {
    // const payload = {};
    try {
      const covertData: PayloadRoleGroup = {
        account_id: formData.account.map(item => parseInt(item.key, 10)),
        name: formData.name,
        note: formData.note,
        status: formData.status
      }
      const response = await putRole(covertData, formData.id, KEY_REQUIRED)
      switch (response) {
        case true: {
          refetch()
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("update") + " " + t("role-account") + " " + t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("update") + " " + t("role-account") + " " + t("fail"),
            }),
          );
          break;
        }
        default: {
          if (typeof response === "object") {
            setErrors(response.missingKeys);
            if (response.isValid) {
              setErrors(response.missingKeys)
              VALIDATE.name = "Tên nhóm đã tồn tại."
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Tên nhóm đã tồn tại.",
                }),
              );
            } else {
              setErrors(response.missingKeys)
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Nhập đẩy đủ dữ liệu",
                }),
              );
            }
          }
        }
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: T("thereWasError"),
        }),
      );
      console.error("==>", error);
    }
  };

  const handleSubmit = () => {
    setIsApi(true)
    statusPage === "create" ? handleSubmitCreate() : handleSubmitUpdate();
    setIsApi(false)
  };
  const handleSelectedServiceChange = (options: Option[]) => {
    // setSelectedService(options);
    setFormData({ ...formData, account: options });
  };

  React.useEffect(() => {
    getListAccount()

    code && getDetail()
  }, []);
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
              {"Tạo nhóm người dùng mới"}
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
          <div
            className="flex flex-col gap-6 overflow-y-auto w-full p-4 max-h-[64vh] md:p-6"
        
          >
            <h2 style={{ fontSize: 18, color: palette.textQuaternary }}>
              {"Thông tin chung"}
            </h2>
            <div className="wrapper-from">
              <MyTextField
                label="Tên nhóm người dùng"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="name"
                placeholder="Nhập tên nhóm người dùng"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "view"}
              />
              <Stack
                direction={"column"}
                spacing={1.5}
                alignItems={"flex-start"}
                sx={{
                  width: "calc(20% - 12px)",
                  height: "fit-content",
                }}
              >
                <label className="label">{T("status")} </label>
                <Box height={32}>
                  <CSwitch
                    disabled={statusPage === "view"}
                    checked={!!formData.status}
                    name="status"
                    onChange={(e) => {
                      handleOnchangeDate(
                        e.target.name,
                        !formData.status ? 1 : 0
                      );
                    }}
                  />
                </Box>
              </Stack>


              <MyTextField
                label="Ghi chú"
                errors={errors}
                required={KEY_REQUIRED}
                name="note"
                placeholder="Nhập ghi chú"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "view"}
              />


            </div>
            <h2 style={{ fontSize: 20, color: palette.textQuaternary }}>
              {"Danh sách người dùng"}
            </h2>
            <MySelectGroupV2
              label=""
              title="Tên nhân viên"
              initTitle="Chọn"
              availableOptions={availableOptions}
              initialSelectedOptions={formData.account}
              onSelectedOptionsChange={
                handleSelectedServiceChange
              }
              validate={VALIDATE}
              errors={errors}
              required={KEY_REQUIRED}
              // disabled={isView}  
              configUI={{
                width: "100%",
              }}
              disabled={statusPage === "view"}
            />
          </div>
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
            {statusPage !== "view" ? (
              <ButtonCore
                title={T("cancel")}
                type="bgWhite"
                onClick={handleClose}
              />
            ) : (
              <ButtonCore
                type="bgWhite"
                title={T("edit")}
                onClick={() => setStatusPage("edit")}
              />
            )}
            {statusPage === "view" ? (
              <ButtonCore title={T("close")} onClick={handleClose} />
            ) : (
              <ButtonCore title={T("save")} onClick={handleSubmit} loading ={isApi} />
            )}
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupEdit);
