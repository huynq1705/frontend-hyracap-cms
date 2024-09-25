import React, { useState, useEffect } from "react";
import { Typography, Table, Pagination, PaginationProps } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import MySelect from "@/components/input-custom-v2/select";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import ActionButton from "@/components/button/action";
import usePermissionCheck from "@/hooks/usePermission";
import PopupEditSalary from "../popup/EditSalary";
import apiStaffSalaryService from "@/api/apiStaffSalary";
import moment from "moment";
import { INIT_STAFF_SALARY } from "@/constants/init-state/staffSalary";
import ButtonCore from "@/components/button/core";
import { KeySearchType } from "@/types/types";
import { convertObjToParam } from "@/utils/filter";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import dayjs from "dayjs";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
import EmptyIcon from "@/components/icons/empty";
interface ColumnProps {
  refetch: () => void;
  actions: {
    [key: string]: (...args: any) => void;
  };
}

const getColumns = (props: ColumnProps) => {
  const { refetch, actions } = props;
  const { T } = useCustomTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { hasPermission } = usePermissionCheck("product");
  return [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {index + 1}
        </Typography.Text>
      ),
      width: 46,
    },
    {
      title: "Nội dung",
      dataIndex: "transfer_code",
      render: (_: any, d: any) => (
        <Stack
          direction={"column"}
          // onClick={() => navigate(`${pathname}/edit/${d?.sh_code}`)}
          sx={{ cursor: "pointer" }}
          spacing={1}
        >
          <Typography style={{ fontSize: "14px", fontWeight: 500 }}>
            {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
            Phiếu lương tháng {moment(d.month).format("MM/YYYY")}
          </Typography>
        </Stack>
      ),
    },

    {
      title: T("action"),
      width: 120,
      dataIndex: "actions",
      fixed: "right" as const,
      shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
      zIndex: 76,
      render: (_: any, d: any) => (
        <>
          {/* check permission */}
          <Stack
            direction={"row"}
            sx={{
              gap: "16px",
              justifyContent: "flex-start",
              alignItems: "center",
              px: "9px",
              boxShadow: "",
            }}
          >
            {hasPermission.getDetail && (
              <ActionButton
                type="view"
                onClick={() => actions.openEditConfirm(true, "detail", d)}
              />
            )}
            {/* {hasPermission.update && <ActionButton type="edit" onClick={() => actions.openEditConfirm(true, "edit", d)} />} */}
            {hasPermission.delete && (
              <ActionButton
                type="remove"
                onClick={() =>
                  actions.openRemoveConfirm(
                    true,
                    d.id,
                    `Phiếu lương tháng ${moment(d.month).format("MM/YYYY")}`,
                  )
                }
              />
            )}
          </Stack>
        </>
      ),
    },
  ];
};

interface ListRequestDepositProps {
  authorizedPermissions?: any;
}

const PageSalary = (props: ListRequestDepositProps) => {
  const { authorizedPermissions } = props;
  const { T } = useCustomTranslation();
  const { getStaffSalary } = apiStaffSalaryService();
  const { code } = useParams();
  const [year, setYear] = useState({
    value: new Date().getFullYear().toString(),
  });

  const [popup, setPopup] = useState({
    remove: false,
    data: INIT_STAFF_SALARY,
    status: "create",
  });
  const [popupRemove, setPopupRemove] = useState({
    remove: false,
    code: "",
    name: "",
  });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "GET_STAFF_SALARY",
      `staff_id__eq__${code} + month__gte__${year.value}-01-01,month__lte__${year.value}-12-31`,
    ],
    queryFn: () =>
      getStaffSalary({
        filter: `staff_id__eq__${code},month__gte__${year.value}-01-01,month__lte__${year.value}-12-31`,
        take: 12,
        page: 1,
      }),
    keepPreviousData: false,
  });
  const togglePopup = (
    params: boolean,
    status: string,
    data: typeof INIT_STAFF_SALARY,
  ) => {
    setPopup((prev) => ({
      ...prev,
      remove: params,
      data: data,
      status: status,
    }));
  };
  const actions = {
    openEditConfirm: (
      key_popup: boolean,
      status: string,
      code_item: typeof INIT_STAFF_SALARY,
    ) => {
      togglePopup(key_popup, status, code_item);
    },
    openRemoveConfirm: (
      key_popup: boolean,
      code_item: string,
      name: string,
    ) => {
      togglePopupRemove(key_popup, code_item, name);
    },
  };
  const togglePopupRemove = (params: boolean, code: string, name: string) => {
    setPopupRemove((prev) => ({ ...prev, remove: params, code: code, name }));
  };

  const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  };

  useEffect(() => {
    refetch();
  }, [year]);
  // useEffect(()=>{
  //   dispatch(setTotalItems(data?.meta?.itemCount || 1))
  // },[data])
  return (
    <Stack
      spacing={2}
      className='overflow-y-auto p-4 w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-250px)]'
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography.Text style={{ fontSize: 18, fontWeight: "500" }}>
          Quản lý tiền lương
        </Typography.Text>
        <ButtonCore
          title="Tính tiền lương"
          type="default"
          onClick={() =>
            setPopup({
              ...popup,
              remove: true,
              data: { ...INIT_STAFF_SALARY, staff_id: Number(code) },
            })
          }
        />
      </Stack>
      <Box
        sx={{
          width: "100%",
          height: 1,
          borderBottom: 1,
          borderColor: "#D0D5DD",
        }}
      />
      <Stack
        width="100%"
        sx={{
          boxShadow: "none",
          marginTop: 0,
          pt: 0,
          // maxHeight: "calc(100vh - 300px)",
          // overflowY: "auto",
          gap: 2,
        }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <MyDatePicker
            label={"Chọn năm"}
            errors={[]}
            configUI={{
              width: "calc(25% - 12px)",
            }}
            name="value"
            placeholder="Chọn"
            handleChange={(e, s) => {
              setYear({ value: s });
            }}
            values={year}
            validate={VALIDATE}
            picker="year"
            formatCalendar="YYYY"
            formatInput="YYYY"
            maxDate={dayjs(new Date())}
            widthBox={"fit-content"}
          />
        </Stack>

        <Table
          size="middle"
          locale={{
            emptyText: (
              <div className="flex justify-center items-center">
                <div className="flex flex-col">
                  <EmptyIcon />
                  <p className="text-center mt-3">Không có dữ liệu</p>
                </div>
              </div>
            ),
          }}
          bordered
          // rowSelection={rowSelection}
          loading={isLoading}
          dataSource={data && Array.isArray(data?.data) ? data.data : []}
          columns={getColumns({
            refetch,
            actions,
          })}
          pagination={false}
          // scroll={{ x: "100%", y: "calc(100vh - 300px)" }}
          className="custom-table"
        />
      </Stack>
      {popup.remove && (
        <PopupEditSalary
          // listItem={selectedRowKeys}
          data={popup.data}
          handleClose={() => setPopup((prev) => ({ ...prev, remove: false }))}
          // data={popup.data}
          refetch={refetch}
        />
      )}
      <PopupConfirmRemove
        listItem={[popupRemove.code]}
        // listItem={selectedRowKeys}
        open={popupRemove.remove}
        handleClose={() =>
          setPopupRemove((prev) => ({ ...prev, remove: false }))
        }
        refetch={refetch}
        name_item={[popupRemove.name]}
      />
    </Stack>
  );
};

export default PageSalary;
