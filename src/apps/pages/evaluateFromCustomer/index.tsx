import styles from "@/assets/styles/make-an-appointment.module.scss";
import ButtonCore from "@/components/button/core";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import { INIT_MAKE_AN_APPOINTMENT } from "@/constants/init-state/make-an-appointment";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import StarBorder from "@/components/icons/star-border";
import StarBG from "@/components/icons/star-bg";
import apiEvaluationCriteriaService from "@/api/apiEvaluationCriteria.service";
import apiAccountOrderService from "@/api/apiAccountOrder";
import apiOrderService from "@/api/apiOrder.service";
import logo from "@/assets/images/logo-remove-bg.png";
import tulips_img from "@/assets/images/Tulips.png";
const DATA = {
  "0": {
    text: "",
    icons: [0, 0, 0, 0, 0],
  },
  "1": {
    text: "(Rất không hài lòng)",
    icons: [1, 0, 0, 0, 0],
  },
  "2": {
    text: "(Không hài lòng)",
    icons: [1, 1, 0, 0, 0],
  },
  "3": {
    text: "(Bình thường)",
    icons: [1, 1, 1, 0, 0],
  },
  "4": {
    text: "(Hài lòng)",
    icons: [1, 1, 1, 1, 0],
  },
  "5": {
    text: "(Cực kỳ hài lòng)",
    icons: [1, 1, 1, 1, 1],
  },
};
interface StarsProps {
  [key: string]: {
    value: keyof typeof DATA;
    label: string;
    order_detail_id?: number;
    id?: number;
  };
}
const EvaluateItem: React.FC<any> = ({ data, onClick }) => {
  return (
    <div className="flex gap-2 items-center justify-between">
      <p className="text-sm font-bold min-w-[180px]">{data.text}</p>
      <div className="flex justify-center items-center h-5  gap-1">
        {data?.icons?.map((x: any, index: number) => (
          <div
            className="h-5 w-5 child:h-5 child:w-5"
            key={"star-" + index}
            onClick={() => {
              onClick(index + 1);
            }}
          >
            {x ? <StarBG /> : <StarBorder />}
          </div>
        ))}
      </div>
    </div>
  );
};
const EvaluateFromCustomerPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const { code } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(INIT_MAKE_AN_APPOINTMENT);
  const [stars, setStars] = useState<StarsProps>({
    common: {
      value: "5",
      label: "Chất lượng dịch vụ",
    },
  });
  const [starAccount, setStarAccount] = useState<StarsProps>({});
  const [starFacilities, setStarFacilities] = useState<StarsProps>({});
  const { getEvaluation, postEvaluation } = apiAccountOrderService();
  const { getEvaluationCriteria } = apiEvaluationCriteriaService();
  const { postEvaluate } = apiOrderService();
  const [successEvaluate, setSuccessEvaluate] = useState(false);
  const initData = async () => {
    if (!code) return;
    try {
      const employee = getEvaluation(+code);
      const criteria = getEvaluationCriteria();
      const response = await Promise.all([employee, criteria]);
      const new_star_employee = { ...starAccount };
      const new_star_facilities = { ...starFacilities };
      const convert_data = response.filter((x) => x.data).map((x) => x.data);
      convert_data[0].forEach((x: any) => {
        new_star_employee[x.id] = {
          label: `${x.order_detail.name} - ${x.account.full_name}`,
          value: "0",
          order_detail_id: x.order_detail.id,
          id: x.account.id,
        };
      });
      convert_data[1].forEach((x: any) => {
        new_star_facilities[x.id] = {
          label: x.name,
          value: "0",
          id: x.id,
        };
      });
      setStarFacilities(new_star_facilities);
      setStarAccount(new_star_employee);
    } catch (e) {
      throw e;
    }
  };
  const onSubmit = async () => {
    if (!code) return navigate("/");
    try {
      const rate_account = Object.entries(starAccount).map(([key, value]) => ({
        order_detail_id: +(value.order_detail_id ?? 0),
        account_id: +(value.id ?? 0),
        star: +value.value,
      }));
      const rate_criteria = Object.entries(starFacilities)
        .map(([key, value]) => ({
          star: +value.value,
          order_id: +code,
          evaluation_criteria_id: +(value?.id ?? 0),
        }))
        .filter((x) => x.evaluation_criteria_id);

      const response = await postEvaluate(
        rate_account,
        rate_criteria,
        formData.note,
        +code,
      );
      setSuccessEvaluate(!!response);
      if (response) {
      }
    } catch (e) {
      throw e;
    }
  };
  const isMobile = useMemo(() => {
    return window.innerWidth < 601;
  }, [window.innerWidth]);

  const handleOnchange = (e: any) => {
    const { name, value, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeStar = (
    key: keyof StarsProps,
    value: number,
    type: "employee" | "facilities" | "common",
  ) => {
    let data = stars;
    if (type === "employee") data = starAccount;
    if (type === "facilities") data = starFacilities;

    const new_value = {
      ...data[key],
      value: value.toString(),
      label: data[key].label,
    };
    const new_data: any = { ...data, [key]: new_value };

    if (type === "employee") setStarAccount(new_data);
    if (type === "facilities") setStarFacilities(new_data);
    if (type === "common") setStars(new_data);
  };
  useEffect(() => {
    initData();
  }, []);
  if (successEvaluate)
    return (
      <div
        className={clsx(
          "w-screen h-screen bg-[var(--text-color-primary)] flex justify-center items-center relative",
        )}
      >
        <div
          className={clsx(
            styles.banner_evaluate,
            "absolute top-0 right-0 left-0 h-1/3",
          )}
        ></div>
        <div className="flex flex-col  items-center justify-center text-white">
          <img src={logo} alt="" />
          <h2 className="w-full font-petit text-[68px] font-semibold max-md:text-[32px] text-center">
            Thank you!
          </h2>
          <p className="text-[32px] text-center w-2/3 mb-[56px] max-md:text-[16px]">
            Cảm ơn Quý khách đã sử dụng dịch vụ và đánh giá!
          </p>
          <img src={tulips_img} alt="" />
        </div>
      </div>
    );
  return (
    <div className={styles.wrapper}>
      <img
        src="/src/assets/images/make-an-appointment_bg.png"
        alt=""
        className={styles.bg_mobile}
      />
      <div className={styles.banner}>
        <div className={clsx(styles.content, code && styles.detail)}>
          <img src="/src/assets/images/logo-remove-bg.png" alt="" />
          <div>
            <span>Đánh giá</span>
          </div>
          <p>Sử dụng dịch vụ tại Mitu</p>
        </div>
      </div>
      <div className={clsx(styles.form, code && styles.detail, "!my-[120px]")}>
        <div className="w-full flex flex-col justify-center items-center mb-8">
          {/* <p className="text-2xl font-bold !text-center w-full max-md:text-lg">
            Bạn cảm thấy thế nào về trải nghiệm dịch vụ hôm nay?
          </p>
          <div className="flex items-center gap-5 mt-6 mb-8 max-md:flex-col">
            <div className="flex gap-2">
              {DATA[stars.common.value].icons.map((x: any, index) => (
                <div
                  key={"star-" + index}
                  onClick={() => {
                    handleChangeStar("common", index + 1, "common");
                  }}
                >
                  {x ? <StarBG /> : <StarBorder />}
                </div>
              ))}
            </div>
            <p>{DATA[stars.common.value].text}</p>
          </div> */}
          <div className="w-full">
            <h3>1. Đánh giá nhân viên</h3>
            <div className="w-full  rounded-xl py-5 flex flex-col justify-center items-center bg-[#FFDFB6] mt-8">
              <div className=" flex flex-col gap-4 px-2">
                {!!Object.keys(starAccount).length &&
                  Object.keys(starAccount).map((key) => (
                    <EvaluateItem
                      key={key}
                      data={{
                        text: starAccount[key].label,
                        icons: DATA[starAccount[key].value].icons,
                      }}
                      onClick={(index: number) => {
                        handleChangeStar(key, index, "employee");
                      }}
                    />
                  ))}
                {!Object.keys(starAccount).length && (
                  <b>Không có nhân viên được chọn !</b>
                )}
              </div>
            </div>
          </div>
          <div className="w-full mt-8">
            <h3>2. Cơ sở vật chất</h3>
            <div className="w-full  rounded-xl py-5 flex flex-col justify-center items-center bg-[#FFDFB6] mt-8">
              <div className=" flex flex-col gap-4">
                {Object.keys(starFacilities).map((key) => (
                  <EvaluateItem
                    key={key}
                    data={{
                      text: starFacilities[key].label,
                      icons: DATA[starFacilities[key].value].icons,
                    }}
                    onClick={(index: number) => {
                      handleChangeStar(key, index, "facilities");
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* description */}
        <MyTextareaAutosize
          label="Nếu có bất kỳ góp ý nào, hãy gửi cho chúng tôi nhé!"
          errors={errors}
          required={[]}
          configUI={{
            width: "100%",
            minRows: 5,
          }}
          name="note"
          placeholder="Góp ý của bạn là vinh hạnh cho chúng tôi"
          handleChange={handleOnchange}
          values={formData}
          validate={{}}
        />
        <div className="flex justify-end w-full mt-4">
          <ButtonCore
            title="Gửi đánh giá"
            styles={{
              width: isMobile ? "100%" : "30%",
              height: "48px",
            }}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};
export default EvaluateFromCustomerPage;
