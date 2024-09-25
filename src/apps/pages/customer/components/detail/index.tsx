import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import HeaderEditPage from "./header";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material";
import TabPanel from "@/components/tab-panel";
import UpdateStep from "./update";
import DebtPage from "./debt";
import TagServicePage from "./tag-service";
import HistoryOrderPage from "./history-order";
import NotePage from "./note";
import HealthCustomerPage from "./health";
import { useLocation, useParams } from "react-router-dom";
import HistoryServicePage from "./history-service";
import apiCommonService from "@/api/apiCommon.service";
import { ResponseCustomerItem } from "@/types/customer";
import { Breadcrumb } from "antd";

export interface DetailPageProps {}
export default function DetailPage(props: DetailPageProps) {
  const { pathname } = useLocation();
  const { code, tag } = useParams();
  const theme = useTheme();
  const [indexPage, setIndexPage] = useState(0);
  const changeIndex = (event: React.SyntheticEvent, newValue: number) => {
    setIndexPage(newValue);
  };
  const [namePage, setNamePage] = useState("- -");
  const [breadcrumb, setBreadcrumb] = useState([
    {
      title: "Thông tin khách hàng",
    },
  ]);
  const { detailCommon } = apiCommonService();
  const handleChangeIndex = (index: number) => {
    setIndexPage(index);
  };
  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<ResponseCustomerItem>(
        code,
        "customer",
      );
      if (response) {
        let name = response.full_name;
        let list: any = [
          {
            title: "Thông tin khách hàng",
          },
        ];
        list.push({
          title: response.full_name,
          href: `/admin/customer/view/${code}`,
        });
        if (tag == "history-service-prepaid") {
          name = "Lịch sử sử dụng thẻ trả trước";
          list.push({
            title: "Lịch sử sử dụng thẻ trả trước",
          });
        }
        if (tag == "history-service-treatment") {
          name = "Lịch sử sử dụng thẻ liệu trình";
          list.push({
            title: "Lịch sử sử dụng thẻ liệu trình",
          });
        }
        setNamePage(name);
        setBreadcrumb(list);
      }
    } catch (e) {
      throw e;
    }
  };
  const LIST_TAB = [
    {
      label: "Thông tin khách hàng",
      element: <UpdateStep />,
    },
    {
      label: "Sức khỏe khách hàng",
      element: <HealthCustomerPage />,
    },
    { label: "Công nợ", element: <DebtPage /> },
    {
      label: "Lịch sử đơn hàng",
      element: <HistoryOrderPage />,
    },
    { label: "Thẻ dịch vụ", element: <TagServicePage /> },
    {
      label: "Ghi chú về khách hàng",
      element: <NotePage />,
    },
  ];
  useEffect(() => {
    getDetail();
  }, [pathname]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-3 py-3 px-5 text-sm">
        <Breadcrumb
          className="custom-breadcrumb"
          items={breadcrumb}
          separator={<FontAwesomeIcon icon={faAngleRight} />}
        />
      </div>
      <h3 className="my-6 pl-5 text-2xl">{namePage}</h3>
      {pathname?.includes("/history-service") && <HistoryServicePage />}
      {!pathname?.includes("/history-service") && (
        <div className="bg-white rounded-xl shadow-md sm:mx-5">
          <HeaderEditPage
            changeIndex={changeIndex}
            index={indexPage}
            listTabs={LIST_TAB}
          />
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={indexPage}
            onChangeIndex={handleChangeIndex}
            className="flex-grow"
          >
            {LIST_TAB.map((item, index) => (
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                key={"content " + index}
                value={indexPage}
                className="p-5"
              >
                <TabPanel value={indexPage} index={index} dir={theme.direction}>
                  {item.element}
                </TabPanel>
              </SwipeableViews>
            ))}
          </SwipeableViews>
        </div>
      )}
    </div>
  );
}
