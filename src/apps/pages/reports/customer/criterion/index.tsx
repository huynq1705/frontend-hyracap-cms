import {
  Box,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Empty, Pagination, PaginationProps, Table, Tooltip, Typography } from "antd";
import { convertStringToArray } from "@/utils";
import { formatDate } from "@/utils/date-time";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import { useEffect, useMemo, useState } from "react";
import { KeySearchType, OptionSelect } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { convertObjToParam, parseQueryParams } from "@/utils/filter";
import apiAccountService from "@/api/Account.service";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import { handleGetDataCommon } from "@/utils/fetch";
import MySelect from "@/components/input-custom-v2/select";
import apiRateService from "@/api/apiRateService";
import apiReportService from "@/api/apiReport";
import _ from "lodash";
import { getFormattedDaysOfMonth } from "../../commission";
import PopupPopupConfirm from "../../component/popup-confirm";
import { DataRateService, ReportRateService } from "@/types/rateService";
import { downloadExcelFile } from "@/api/apiCommon.service";

const btnStyleBgWhite = {
  backgroundColor: "var(--btn-color-secondary)",
  color: "var(--btn-color-primary)",
};

const CustomCardList = ({ dataConvert }: any) => {
  return (
    <div className=" flex md:hidden flex-col space-y-4">
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
            <span className="font-medium text-gray-9 text-sm">Tên tiêu chí</span>
            <div className="text-gray-9 text-base py-1">
              <span className="font-medium" style={{ color: "#50945d" }}>
                {item?.evaluation_criteria?.name.length > 20 ?
                  item?.evaluation_criteria?.name.slice(0, 30) + "..." :
                  item?.evaluation_criteria?.name ? item?.evaluation_criteria?.name :
                    "- -"}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Mã đơn hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.order?.id}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Nhân viên thực hiện đơn hàng</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.order?.creator?.full_name}
              </span>
            </div>
          </div>
          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Điểm đánh giá</span>
            <div className="text-gray-9 text-base py-1">
              <span>
                {item?.order?.id}
              </span>
            </div>
          </div>

          <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
            <span className="font-medium text-gray-9 text-sm">Thời gian đánh giá</span>
            <div className="text-gray-9 text-base py-1">
              <span>{formatDate(item?.created_at, "DDMMYYYY")}</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

const getColumns = () => {
  const columns: any = [
    {
      title: "STT",
      dataIndex: "order",

      render: (_: any, item: any, index: number) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
              textAlign: "center",
            }}
          >
            {index + 1}
          </Typography>
        </Stack>
      ),
      width: 50,
    },
    {
      title: "Tên tiêu chí",
      dataIndex: "customer",
      fixed: "left" as const,
      render: (_: any, item: any) => {
        const tooltip = item?.evaluation_criteria?.name ?? "- -";
        const content =
          tooltip.length > 20 ? tooltip.slice(0, 30) + "..." : tooltip;
        return (
          <Box>
            <Tooltip placement="topLeft" title={tooltip}>
              {content}
            </Tooltip>
          </Box>
        );
      },
      width: 220,
    },
    {
      width: 160,
      title: "Mã đơn hàng",
      dataIndex: "price",
      render: (_: any, d: any) => (
        <Typography.Text>
          {d?.order?.id}
        </Typography.Text>
      ),
    },
    {
      title: "Nhân viên thực hiện đơn hàng",
      dataIndex: "active",
      width: 220,
      render: (_: any, d: any) => {
        return (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {d?.order?.creator?.full_name}
          </Typography>
        );
      },
    },
    {
      title: "Điểm đánh giá",
      dataIndex: "active",
      width: 175,
      render: (_: any, d: any) => {
        return (
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            <Tooltip placement="topLeft" title={'k'}>
              {d?.star}
            </Tooltip>
          </Typography>
        );
      },
    },
    {
      title: "Thời gian đánh giá",
      dataIndex: "PTTT",
      width: 160,
      render: (_: any, d: any) => (
        <Stack direction={"column"} spacing={1}>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-color-three)",
            }}
          >
            {formatDate(d?.created_at, "DDMMYYYY")}
          </Typography>
        </Stack>
      ),
    },
  ];
  return columns;
};

const CriterionPage = () => {
  const { code } = useParams();
  const { T, t } = useCustomTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [content, setContent] = useState("");
  const { pathname } = useLocation();

  const anyDate = new Date();
  const days = getFormattedDaysOfMonth(anyDate);

  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (!params["page"]) params["page"] = 1;
    if (!params["take"]) params["take"] = 10;
    if (!params["start_date"]) params["start_date"] = days.firstDay;
    if (!params["end_date"]) params["end_date"] = days.lastDay;
    if (!params["evaluation_criteria_id"]) params["evaluation_criteria_id"] = code;
    if (!params["star"]) params["star"] = undefined;
    return params;
  };
  const handleGetPage = () => {
    const current_age = searchParams.get("page");
    const page_size = searchParams.get("take");
    return {
      currentPage: current_age ? +current_age : 1,
      pageSize: page_size ? +page_size : 10,
    };
  };

  const { currentPage, pageSize } = handleGetPage();
  const param_payload = useMemo(() => {
    return handleGetParam();
  }, [searchParams]);

  const [keySearch, setKeySearch] = useState<KeySearchType>({});
  const [flagSearch, setFlagSearch] = useState(false);
  const [page, setPage] = useState({
    currentPage,
    pageSize,
    totalPage: 1,
    totalItem: 1,
  });

  const { getRateService } = apiRateService();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["GET_RATE_SERVICE", param_payload, pathname],
    queryFn: () => getRateService(param_payload),
    keepPreviousData: true,
  });
  // convert data
  const dataConvert = useMemo(() => {
    const data_res = data;
    if (data_res) {
      console.log('data_res', data_res);

      return data_res.data;
    }
    const result: DataRateService[] = []
    return result;
  }, [data]);

  useEffect(() => {
    if (data && data?.meta) {
      setPage((prev) => ({
        ...prev,
        totalItem: data?.meta?.itemCount ?? 1,
      }));
    }
  }, [data]);

  useEffect(() => {
    const new_key_search = parseQueryParams(param_payload);
    setKeySearch(new_key_search);
  }, []);

  useEffect(() => {
    if (flagSearch) handleSearch();
  }, [flagSearch]);

  const handleSearch = () => {
    let filter = convertObjToParam(keySearch, {
      page: page.currentPage,
      take: page.pageSize,
    });
    let url = `${pathname}${filter}`;
    setFlagSearch(false);
    navigate(url);
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    setPage((prev) => ({ ...prev, currentPage: pageNumber }));
    searchParams.set("page", pageNumber.toString());
    setSearchParams(searchParams);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setPage((prev) => ({ ...prev, pageSize }));
    searchParams.set("take", pageSize.toString());
    setSearchParams(searchParams);
  };

  const { getAccount } = apiAccountService();
  const { getReportEvaluationCriteria } = apiReportService();
  const [formData, setFormData] = useState(REPORT_REVENUE);
  const [errors, setErrors] = useState<string[]>([]);
  const [reviews, setReviews] = useState<OptionSelect>([
    { value: "0", label: "Tất cả" },
    { value: "1", label: "1 Sao" },
    { value: "2", label: "2 Sao" },
    { value: "3", label: "3 Sao" },
    { value: "4", label: "4 Sao" },
    { value: "5", label: "5 Sao" },
  ]);
  const [account, setAccount] = useState<OptionSelect>([]);
  const [evaluationCriteria, setEvaluationCriteria] = useState<OptionSelect>([]);

  const initData = () => {
    const convert_account = (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        value: item.id.toString(),
        label: item.full_name,
      }));
    };
    const convert = (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        value: item.evaluation_criteria_id.toString(),
        label: item.evaluation_criteria_name,
      }));
    };
    handleGetDataCommon(getAccount, convert_account, setAccount);
    handleGetDataCommon(getReportEvaluationCriteria, convert, setEvaluationCriteria);
  };

  useEffect(() => {
    initData();
    setFormData((prev) => ({ ...prev, ["evaluation_criteria"]: [code] }));
  }, []);

  useEffect(() => {
    let star: any = []
    const formattedMonth = param_payload?.startDate ? param_payload.startDate : days.firstDay;
    const account_id = param_payload?.account_id ? param_payload?.account_id : code
    if (reviews.length > 0) {
      star = param_payload?.star ? convertStringToArray(param_payload.star) : reviews?.map(item => item.value);
    }
    setFormData(prev => ({ ...prev, month: formattedMonth, person_in_charge: account_id, reviews: star }))
  }, [param_payload, account])

  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;

    if (name === "evaluation_criteria") {
      let new_value = value;
      searchParams.set("evaluation_criteria_id", new_value);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    if (name === "reviews") {
      const option = reviews;
      const old_value = formData["reviews"];
      const item_click = _.xor(old_value, value)[0];
      let new_value = value;
      let new_value_params = value
      if (item_click == "0" && old_value.length === option.length) {
        new_value = [];
        new_value_params = ["-1"];
      }
      if (item_click == "0" && old_value.length !== option.length) {
        new_value = option.map((x) => x.value);
        new_value_params = [];
      }
      if (item_click != "0") {
        new_value = value.filter((x: any) => x != "0" && x != "-1");
        new_value_params = value.filter((x: any) => x != "0" && x != "-1");
      }

      searchParams.set("star", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
  };

  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const anyDate = new Date(value);
    const days = getFormattedDaysOfMonth(anyDate);
    searchParams.set("startDate", days.firstDay);
    searchParams.set("endDate", days.lastDay);
    setSearchParams(searchParams);
  };

  const arrayButtonExport = [
    {
      label: "Báo cáo đánh giá tiêu chí",
      fn: () => {
        setPopup(true);
        setContent("báo cáo đánh giá tiêu chí");
      },
    },
  ];
  const handleOnConfirm = () => {
    setPopup(false);
    downloadExcelFile('rate-service/export', param_payload)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-3 py-3 px-5 text-sm bg-white">
        <b onClick={() => { navigate(`/admin/report-customer`) }}
          className="text-[var(--text-color-primary)] cursor-pointer">Báo cáo đánh giá khách hàng</b>
        <FontAwesomeIcon icon={faAngleRight} />
        <span>{"Báo cáo đánh giá tiêu chí chi tiết" ?? "- -"}</span>
      </div>
      <div className="flex flex-wrap items-start gap-3 sm:flex-row justify-between py-6 px-4 ">
        <h2 >Đánh giá tiêu chí {dataConvert[0]?.evaluation_criteria?.name ?? "- -"}</h2>
        <div
          className="flex items-center button-core"
          style={btnStyleBgWhite}
          onClick={arrayButtonExport[0].fn}
        >
          <FontAwesomeIcon icon={faDownload} />
          Tải xuống
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md sm:mx-5">
        <Box className="custom-table-wrapper relative">
          <div className="wrapper-from flex-wrap flex gap-4 items-start ">
            <MyDatePicker
              label={"Lọc theo thời gian"}
              errors={errors}
              // required={KEY_REQUIRED}
              configUI={{
                width: "calc(25% - 8px)",
              }}
              name="month"
              placeholder="Chọn"
              values={formData}
              handleChange={handleOnchangeDate}
              validate={{}}
              formatInput="YYYY-MM-DD"
              picker="month"
              formatCalendar="MM/YYYY"
              disabled={formData.id}
            />
            <MySelect
              configUI={{
                width: "calc(20% - 13px)",
              }}
              label="Tên tiêu chí đánh giá"
              name="evaluation_criteria"
              handleChange={handleOnchange}
              values={formData}
              options={evaluationCriteria}
              errors={errors}
              validate={{}}
              itemsPerPage={6}
              type="select-one"
            />
            <MySelect
              configUI={{
                width: "calc(20% - 13px)",
              }}
              label="Điểm đánh giá"
              name="reviews"
              handleChange={handleOnchange}
              values={formData}
              options={reviews}
              errors={errors}
              validate={{}}
              itemsPerPage={6}
              type="select-multi"
            />
          </div>
          {/* <Card> */}
          <CustomCardList dataConvert={dataConvert} />
          {dataConvert.length < 1 && <Empty className="hidden max-sm:block w-full justify-center items-center" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          <Table
            size="middle"
            bordered
            // rowSelection={rowSelection}
            loading={isLoading}
            dataSource={dataConvert}
            columns={getColumns()}
            pagination={false}
            scroll={{ x: "100%", y: "calc(100vh - 150px)" }}
            className="custom-table hidden md:block sm:max-h-[calc(100vh-200px)]"
          />
          {/* search */}
          <Pagination
            className="custom-pagination  bg-white max-lg::overflow-hidden"
            pageSize={page.pageSize}
            current={page.currentPage}
            showQuickJumper
            defaultCurrent={10}
            showSizeChanger
            locale={{
              items_per_page: 'bản ghi/trang',
              jump_to: 'Đến',
              page: 'trang',
            }}
            onShowSizeChange={onShowSizeChange}
            total={page.totalItem}
            onChange={onChangePage}
            showTotal={(total, range) => {
              return `Hiển thị ${range[0]}-${range[1]} của ${total} mục`;
            }}
          />
        </Box>
      </div>
      <PopupPopupConfirm
        open={popup}
        onClose={() => {
          setPopup(false);
        }}
        onConfirm={handleOnConfirm}
        content={content}
      />
    </div>
  );
}
export default CriterionPage;
