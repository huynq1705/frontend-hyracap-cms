import styles from "@/assets/styles/make-an-appointment.module.scss";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
const CRow: React.FC<any> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span className="text-base font-semibold">{label} :</span>
      <span className="text-base font-bold">{value}</span>
    </div>
  );
};
interface DetailMakeAnAppointmentPageProps {
  data: any;
}
const DetailMakeAnAppointmentPage = (
  props: DetailMakeAnAppointmentPageProps,
) => {
  const navigate = useNavigate();
  const { data } = props;
  return (
    <>
      <div className={styles.wrapper}>
        <img
          src="/src/assets/images/make-an-appointment_bg.png"
          alt=""
          className={styles.bg_mobile}
        />
        <div className={styles.banner}>
          <div className={clsx(styles.content, styles.detail)}>
            <img src="/src/assets/images/logo-remove-bg.png" alt="" />
          </div>
        </div>
        <div className={clsx(styles.form, styles.detail)}>
          <div className="w-full">
            <div
              className="flex flex-row items-center mb-8 gap-8 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <h2>Chi tiết lịch hẹn</h2>
            </div>
            <div className="w-full rounded-xl p-3 gap-3 flex flex-col">
              <CRow label="Mã lịch hẹn" value={data?.id || "- -"} />
              <CRow label="Số điện thoại" value={data?.phone_number || "- -"} />
              <CRow label="Email" value={data?.email || "- -"} />
              <CRow label="Khung giờ" value={data?.rang_time || "- -"} />
              <CRow label="Dịch vụ" value={data?.services || "- -"} />
              <CRow label="Ghi chú" value={data?.note || "- -"} />
            </div>
            <div className="p-3 my-4 flex gap-4 items-center">
              <Avatar
                size={64}
                icon={
                  data?.staff?.image ? (
                    <img src={data?.staff?.image || ""} />
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )
                }
              />
              <div className="flex flex-col">
                <span className="text-sm text-black font-medium">
                  Nhân viên thực hiện
                </span>
                <b className="text-lg text-[var(--text-color-primary)]">
                  {data?.staff?.full_name || "- -"}
                </b>
              </div>
            </div>
            <Box
              sx={{
                backgroundColor: "#F4F8EE",
              }}
              className="w-full rounded-xl p-3 gap-3 flex flex-col"
            >
              <h4 className="text-base font-bold">THÔNG TIN CỦA SPA</h4>
              <CRow label="Tên spa" value="Mitu Hùng Vương" />
              <CRow label="Số điện thoại" value="0367093876" />
              <CRow label="Địa chỉ" value="76 Nguyễn Chí Thanh" />
            </Box>
          </div>
        </div>
        <div className={styles.bottom}></div>
      </div>
    </>
  );
};
export default DetailMakeAnAppointmentPage;
