import {
    Box,
    Checkbox,
    Dialog,
    DialogActions,
    Slide,
    Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import {  Table, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import apiPositionService from "@/api/apiPosition.service";
import apiRoleService from "@/api/apiRole.service";


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
    status: string | "create";
    code : string

}


function PopupListPosition(props: PopupConfirmRemoveProps) {
    const { handleClose, status, code } = props;
    const { getPosition } = apiPositionService();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const [statusPage, setStatusPage] = React.useState(status);
    const { getRoleDetail, putRole } = apiRoleService();
    const [errors, setErrors] = React.useState<string[]>([]);
    const [listPermission,setListPermission] = React.useState<number[]>([])
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_POSITION"],
        queryFn: () => getPosition(),
        keepPreviousData: true,
    });
    

    const getDetail = async () => {
        try {

            const response = await getRoleDetail(code);
            if (response.data) {
                setListPermission(response.data.role_permission?.map(item => item.permission.id) || []);
            }
        } catch (e) {
            throw e;
        }
    };
  
    const handleSubmitUpdate = async () => {
        // const payload = {};
            try {
            const response = await putRole({ permission_id : listPermission},code, [])
            switch (response) {
                case true: {
                    // navigate("/customer");
                    refetch && refetch()
                    handleClose()
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
                    message: "createError",
                }),
            );
            console.error("==>", error);
        }
    };

    const handleSubmit = () => {
        handleSubmitUpdate();
    };
    const handleCheckBox = (id : number)=>{
        if (listPermission.includes(id)) {
            setListPermission([...listPermission.filter(item => item !== id)])
        } else {
            listPermission.push(id)
            setListPermission([...listPermission])
        }

    }
    React.useEffect(() => {
        setStatusPage(status);
        setErrors([]);
        getDetail()
    }, []);
    const columns = [
        {
            title: "",
            dataIndex: "stt",
            render: (_: any, item: any, index: number) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                        textAlign:'left'
                    }}
                >
                    {item?.description}
                </Typography>
            ),
        },
        // {
        //     title: "Mã ",
        //     dataIndex: "id",
        //     width: 160,
        //     render: (_: any, d: any) => (
        //         <Typography.Text
        //             style={{
        //                 fontSize: "14px",
        //                 fontWeight: 400,
        //                 color: palette.textQuaternary
        //             }}
        //         >
        //             {d?.id}
        //         </Typography.Text>
        //     ),
        // },
      
        {
            title: "admin",
            width: 94,
            dataIndex: "status",
            render: (_: any, d: any) => (
                <Stack justifyContent={"center"} alignItems={"center"} >
                    {/* <CSwitch checked={!!d?.status} /> */}
                    {/* <Checkbox checked={listPermission.includes(d?.id)}  on/> */}
                    <Checkbox
                        size="small"
                        checked={listPermission.includes(d?.id)}
                        sx={{
                            padding: 0,
                            "&.Mui-disabled": {
                                color: "#50945D", // Color when disabled
                            },
                        }}
                        onClick={()=>handleCheckBox(d?.id)}
                    />
                </Stack>
            ),
        },
        ]

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
                            {"Phân quyền nhóm người dùng"}
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
                        width="100%" className="custom-table-wrapper"
                    
                        spacing={3}
                        sx={{
                            overflowY: "unset",
                            scrollbarWidth: "thin",
                            maxHeight: "60vh",
                            p: 2,
                            width: "100%",
                            boxShadow: 'none', height: "calc(100vh - 300px)",
                            backgroundColor:'white'
                        }}
                    >
                        <Table
                            size="middle"
                            bordered
                            loading={isLoading}
                            dataSource={data && Array.isArray(data?.data) ? data.data : []}
                            columns={columns}
                            pagination={false}
                            scroll={{ x: "100%", y: "calc(70vh - 112px)" }}
                            className="custom-table"
                            style={{ maxHeight:"calc(70vh - 112px)"}}
                        />
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
                                title={T("edit")}
                                onClick={() => setStatusPage("edit")}
                            />
                        )}
                        {statusPage === "detail" ? (
                            <ButtonCore title={T("close")} onClick={handleClose} />
                        ) : (
                            <ButtonCore title={T("save")} onClick={handleSubmit} />
                        )}
                    </Stack>
                </Box>
            </Dialog>
        </>
    );
}
export default React.memo(PopupListPosition);
