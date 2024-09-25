import React from "react";
import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useLocation, useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import apiCommonService from "@/api/apiCommon.service";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getKeyPage } from "@/utils";
import { Button, Image, Progress, Typography, Upload, UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface PopupConfirmImportProps {
  refetch?: () => void;
  handleClose: () => void;
  open: boolean;
}

type FileType = File;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function PopupConfirmImport(props: PopupConfirmImportProps) {
  const { handleClose, open, refetch } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T } = useCustomTranslation();
  const { pathname } = useLocation();
  const { importData } = apiCommonService();
  const urlPayload = getKeyPage(pathname, "key")
  const title_page = T(urlPayload);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [intervalId, setIntervalId] = React.useState<number | null>(null);

  const handleSave = async () => {
 
    try {
      const files = fileList.map((file: any) => file.originFileObj);
      const response = await importData(files[0],urlPayload);
        if (response) {
        handleClose();
          navigate("/admin/customer?filter=")
        dispatch(
          setGlobalNoti({
            type: "success",
            message: `Cập nhật ${title_page} thành công`,
          })
        );
      }else{
        dispatch(
          setGlobalNoti({
            type: "error",
            message: `Cập nhật ${title_page} không thành công`,
          })
        );
      }
    } catch (e) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: `Cập nhật ${title_page} không thành công`,
        })
      );
      throw e;
    }

    
  };

  const handleChange: UploadProps["onChange"] = ({
    file,
    fileList: newFileList,
  }) => {
    setProgress(0)
    setFileList(newFileList);
    setUploading(true);
    const newIntervalId = window.setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(newIntervalId);
          setUploading(false);
          // setProgress(0)
          return 100;
        }
        return prevProgress + 20;
      });
    }, 600);
    setIntervalId(null);
  };


  React.useEffect(() => {
    return () => {  
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box className="popup-remove-wrapper overflow-x-hidden">
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 22px 16px 16px",
          }}
        >
      
          <p className="text-[20px] font-bold">Tải lên tệp {title_page}</p>
          <ButtonCore
            title=""
            type="secondary"
            onClick={handleClose}
            icon={<FontAwesomeIcon icon={faXmark} />}
          />
        </Stack>
        <div className="px-4">
          <div className="flex flex-col items-center justify-between mb-2 md:flex-row">
            <p className="text-sm">
              Định dạng: XLS, XLSX Dung lượng không quá 5MB
            </p>
            <ButtonCore
              title="Tải xuống tệp mẫu"
              type="secondary"
              icon={<FontAwesomeIcon icon={faDownload} />}
            />
          </div>
          <div className="w-[568px] h-[156px] border-dashed border-[#2E90FA] rounded-xl border bg-[#F5F9FF] flex flex-col justify-center items-center gap-[10px] mb-2 cursor-pointer">
            <Upload
              fileList={[]}
              onChange={handleChange}
              beforeUpload={() => false}
              multiple={false} 
              accept=".xls,.xlsx"
            >
              {/* <Button icon={<UploadOutlined />}>Chọn File</Button> */}
              <div className="w-[568px] h-[156px] border-dashed border-[#2E90FA] rounded-xl border bg-[#F5F9FF] flex flex-col justify-center items-center gap-[10px]">
                <div className="w-[72px] h-[72px] bg-[#E0EEFE] text-[#0D63F3] rounded-full flex justify-center items-center text-xl">
                  <FontAwesomeIcon icon={faUpload} />
                </div>
                <p>
                  Kéo thả tệp đính kèm hoặc{" "}
                  <span className="underline decoration-1">
                    Chọn tệp
                  </span>
                </p>
              </div>
            </Upload>



          </div>
          {
            (uploading || progress === 100) &&
            <Typography.Text >
             
                {progress === 100 ? "Tải lên hoàn tất" : "Đang tải lên 1 tệp"}
            </Typography.Text>
          }
          {(uploading || progress === 100)&& (
            <div className="flex gap-2 items-center bg-[#F9FAFB] p-[12px] rounded-md mt-1">
              <Image
                src="https://cdn.icon-icons.com/icons2/195/PNG/256/Excel_2013_23480.png"
                width={"48px"}
                height={"48px"}
              />
              <div className="flex-1 gap-0 relative justify-center items-center">
                <Typography.Text style={{ fontSize: 12, position: 'absolute', top: -10 }}>
                  {fileList[0].name}
                </Typography.Text>
                <Typography.Text style={{ fontSize: 12, position: 'absolute', bottom: -13 }}>
                  {((Number(fileList[0].size)) / 1024 / 1024).toFixed(2)} MB 
                </Typography.Text>
                <Progress
                  percent={progress}
                  status={progress === 100 ? "success" : "active"}
                />

              </div>
            </div>
            )}
         
        </div>
        <Stack
          direction={"row"}
          justifyContent={"flex-end"}
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
            onClick={handleClose}
          />
          <ButtonCore title={T("confirm")} onClick={handleSave} />
        </Stack>
      </Box>
    </Dialog>
  );
}

export default React.memo(PopupConfirmImport);
