import apiCustomerNoteService from "@/api/apiCustomerNote.service";
import ActionButton from "@/components/button/action";
import ButtonCore from "@/components/button/core";
import { formatDate } from "@/utils/date-time";
import { handleGetDataCommon } from "@/utils/fetch";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack } from "@mui/material";
import { Empty, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import PopupCustomerNote from "@/components/popup/customer-note";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import { useParams } from "react-router-dom";
import EmptyIcon from "@/components/icons/empty";
export interface NotePageProps {}

export default function NotePage(props: NotePageProps) {
  const {} = props;
  const { code } = useParams();
  const [customerNote, setCustomerNote] = useState<any[]>([]);
  const [popup, setPopup] = useState({
    edit: false,
    remove: false,
  });
  const [dataEdit, setDataEdit] = useState({ note: "", id: 0 });
  const [IDRemove, setIDRemove] = useState(0);
  const { getCustomerNote } = apiCustomerNoteService();
  const init = () => {
    const convert = (array: any[]) => {
      return array.map((it) => it);
    };
    handleGetDataCommon(getCustomerNote, convert, setCustomerNote);
  };

  useEffect(() => {
    init();
  }, [popup]);
  const handleEdit = (value: { note: string; id: number }) => {
    setDataEdit(value);
    setPopup((prev) => ({ ...prev, edit: true }));
  };
  const openRemoveConfirm = (id: number) => {
    setIDRemove(id);
    setPopup((prev) => ({ ...prev, remove: true }));
  };
  const actions = { handleEdit, openRemoveConfirm };
  return (
    <div>
      {/* header */}
      <Box
        className="pb-4 sm:flex justify-between items-center"
        sx={{
          borderBottom: "1px solid #D0D5DD",
        }}
      >
        <h3 className="max-sm:mb-3">Ghi chú về khách hàng</h3>
        <div className="flex items-center gap-3 pr-2">
          <ButtonCore
            title="Thêm ghi chú"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => {
              setPopup((prev) => ({ ...prev, edit: true }));
            }}
          />
        </div>
      </Box>
      {/* content */}
      <Box
        className="flex flex-wrap px-2 items-center mt-4"
        sx={{
          maxHeight: "calc(100vh - 380px)",
          overflowY: "auto",
          gap: "24px",
        }}
      >
        <CustomCardList dataConvert={customerNote} actions={actions} />
        {customerNote.length < 1 && (
          <Empty
            className="hidden max-sm:block w-full justify-center items-center"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
        <Table
          size="middle"
          locale={{
            emptyText: (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col">
                  <EmptyIcon />
                  <p className="text-center mt-3">Không có dữ liệu</p>
                </div>
              </div>
            ),
          }}
          bordered
          dataSource={customerNote}
          columns={getColumns({
            actions,
          })}
          pagination={false}
          scroll={{ x: "100%", y: "calc(100vh - 430px)" }}
          className="custom-table-customer hidden md:block"
        />
      </Box>
      {code && (
        <PopupCustomerNote
          open={popup.edit}
          onClose={() => {
            setPopup((prev) => ({ ...prev, edit: false }));
          }}
          customer_id={+code}
          dataEdit={dataEdit}
        />
      )}
      <PopupConfirmRemove
        handleClose={() => {
          setPopup((prev) => ({ ...prev, remove: false }));
        }}
        open={popup.remove}
        end_point="/customer-note"
        listItem={[IDRemove ?? "0"]}
        name_item={[""]}
      />
    </div>
  );
}
const CustomCardList = ({ dataConvert, actions }: any) => {
  // const { hasPermission } = usePermissionCheck("product");
  // const navigate = useNavigate();

  return (
    <div className="w-full flex md:hidden flex-col space-y-4">
      {dataConvert.map((item: any, index: any) => (
        <div
          key={item.id}
          className="border border-solid border-gray-4 shadow rounded-lg mb-4"
        >
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">STT</span>
            <div className="text-gray-9 text-base py-1">
              <span>{index + 1}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thời gian</span>
            <div className="text-gray-9 text-base py-1">
              <span> {formatDate(item.created_at, "DDMMYYYY")}</span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Nhân viên</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.account?.full_name ?? "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Ghi chú</span>
            <div className="text-gray-9 text-base py-1">
              <span> {item?.note ?? "- -"}</span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Hành động</span>
            <div className="text-gray-9 text-base py-1">
              <div className="flex items-center g-8 justify-start space-x-4">
                <ActionButton
                  type="edit"
                  onClick={() =>
                    actions.handleEdit({ id: item?.id, note: item?.note })
                  }
                />
                <ActionButton
                  type="remove"
                  onClick={() => actions.openRemoveConfirm(item?.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
const getColumns = (props: any) => {
  const { actions } = props;
  const columns = [
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
      title: "Thời gian",
      dataIndex: "date",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {formatDate(item.created_at, "DDMMYYYY")}
        </Typography.Text>
      ),
      width: 100,
    },
    {
      title: "Nhân viên",
      dataIndex: "employee",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.account?.full_name ?? "- -"}
        </Typography.Text>
      ),
      width: 120,
    },
    {
      title: "Ghi chú",
      dataIndex: "employee",
      render: (_: any, item: any, index: number) => (
        <Typography.Text
          style={{
            fontSize: "14px",
          }}
        >
          {item?.note ?? "- -"}
        </Typography.Text>
      ),
      width: 200,
    },
    {
      title: "Hành động",
      width: 100,
      dataIndex: "actions",
      fixed: "right" as const,
      shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
      zIndex: 100,
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
            <ActionButton
              type="edit"
              onClick={() => actions.handleEdit({ id: d?.id, note: d?.note })}
            />
            <ActionButton
              type="remove"
              onClick={() => actions.openRemoveConfirm(d?.id)}
            />
          </Stack>
        </>
      ),
    },
  ];
  return columns;
};
