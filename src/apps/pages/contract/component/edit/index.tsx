import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiProductService from "@/api/apiProduct.service";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { INIT_PRODUCT } from "@/constants/init-state/product";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { ResponseProductItem } from "@/types/product";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import dayjs from "dayjs";
import apiAccountService from "@/api/Account.service";
import MySelect from "@/components/input-custom-v2/select";
import CurrencyInput from "@/components/input-custom-v2/currency";
import MyTextField from "@/components/input-custom-v2/text-field";
import { INIT_CONTRACT } from "@/constants/init-state/contract";
import apiContractService from "@/api/apiContract.service";
const VALIDATE = {
    capital: "Hãy nhập số vốn đầu tư",
    user_sub: "Hãy chọn tên khách hàng",
    product_id: "Hãy chọn sản phẩm đầu tư",
    duration: "Hãy nhập thời hạn đầu tư",
};
const KEY_REQUIRED = ["capital", "duration", "user_sub", "product_id"];
interface EditPageProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}
export default function EditPage(props: EditPageProps) {
    //--init
    const { onClose, refetch, open } = props;
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { postProduct, putProduct } = apiProductService();
    const { postContract, putContract } = apiContractService();
    const { getProduct } = apiProductService();
    const { getAccount } = apiAccountService();

    const getAllProduct = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
                total_invested__lt: "column_total_capacity",
            };
            const response = await getProduct(param);
            if (response) {
                setProduct(
                    response.data.map((it: any) => ({
                        value: it.id.toString(),
                        label: it.name,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getAllAccount = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getAccount(param);
            if (response) {
                setAccount(
                    response.data
                        .filter((it: any) => it.kycStatus === "VERIFIED")
                        .map((it: any) => ({
                            value: it.sub.toString(),
                            label: `${it?.firstName}` + " " + `${it?.lastName}`,
                        }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(code, "/contract");
            if (response) {
                const convert_data = {
                    id: response.id,
                    capital: response.capital,
                    duration: response.duration,
                    product_id: response.product.id,
                    user_sub: response.user_sub,
                    staff_id: response.staff_id,
                };
                setFormData(convert_data);
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Failed to fetch product details",
                })
            );
        }
    };
    const handleCreate = async () => {
        try {
            const response = await postContract(formData, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response.statusCode === 422) {
                message = `${response.error.message}`;
                type = "error";
            }
            if (response.statusCode === 200) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
                setFormData(INIT_CONTRACT);

                handleCancel();
            }
            dispatch(
                setGlobalNoti({
                    type,
                    message,
                })
            );
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Thông tin nhập không phù hợp",
                })
            );
        }
    };
    const handleCancel = () => {
        setFormData(INIT_CONTRACT);
        navigate("/admin/contract");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/contract/edit/${code}`);
        } else {
            // dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
            // setFormData(INIT_CONTRACT);
            // refetch();
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putContract(formData, code, KEY_REQUIRED);
            let message = `Cập nhật ${title_page} thất bại`;
            let type = "error";
            // if (typeof response === "object" && response?.missingKeys) {
            //     setErrors(response.missingKeys);
            //     return;
            // }
            if (response.statusCode === 422) {
                message = `${response.error.message}`;
                type = "error";
            }
            if (response.statusCode === 200) {
                message = `Cập nhật ${title_page} thành công`;
                type = "success";
                setFormData(INIT_CONTRACT);
            }
            dispatch(
                setGlobalNoti({
                    type,
                    message,
                })
            );
            if (response === true) {
                handleCancel();
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "updateError",
                })
            );
            console.error(error);
        }
    };
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleOnchangeCurrency = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    const title_page = T(getKeyPage(pathname, "key"));
    //--state
    const [product, setProduct] = useState<OptionSelect>([]);
    const [account, setAccount] = useState<OptionSelect>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_CONTRACT);
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const actions = useMemo(
        () => ({ handelSave, handleRemove, handleCancel }),
        [formData]
    );
    //--effect
    useEffect(() => {
        code && getDetail();
        if (open) {
            getAllProduct();
            getAllAccount();
        }
    }, [code, open]);
    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />
            <div className="wrapper-edit-page">
                <div className="wrapper-from items-end">
                    <div style={{ lineHeight: 1.6 }}>
                        <h1 style={{ textAlign: "center" }}>
                            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </h1>
                        <h2 style={{ textAlign: "center" }}>
                            Độc lập – Tự do – Hạnh phúc
                        </h2>
                        <p style={{ textAlign: "end" }}>
                            …., ngày….tháng….năm…
                        </p>

                        <h3 style={{ textAlign: "center" }}>
                            HỢP ĐỒNG GÓP VỐN KINH DOANH
                        </h3>
                        <p style={{ textAlign: "center" }}>Số: …/…/HĐGVKD</p>

                        <p>Căn cứ Bộ luật dân sự năm 2015;</p>
                        <p>
                            Căn cứ vào nhu cầu kinh doanh và năng lực của các
                            bên.
                        </p>
                        <p>Chúng tôi gồm:</p>

                        <h4>BÊN NHẬN GÓP VỐN (BÊN A):</h4>
                        <p>Tên tổ chức: CÔNG TY CỔ PHẦN HYRATEK</p>
                        <p>
                            Trụ sở chính: Lô CX01, Khu đô thị Văn Khê, Phường La
                            Khê, Quận Hà Đông, TP Hà Nội
                        </p>
                        <p>Mã số thuế: 0110057231</p>
                        <p>
                            Đại diện bởi: Trần Nam Chung. Chức vụ: Giám đốc
                            chiến lược-Người sáng lập
                        </p>

                        <h4>BÊN GÓP VỐN (BÊN B):</h4>
                        <div className="flex items-center gap-3 pb-3">
                            <p>Ông/bà: </p>
                            <MySelect
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="user_sub"
                                handleChange={handleOnchange}
                                values={formData}
                                options={account}
                                errors={errors}
                                validate={VALIDATE}
                                required={KEY_REQUIRED}
                                itemsPerPage={5} // Adjust items per page as needed
                                disabled={isView}
                                placeholder="Chọn"
                            />
                            {/* <p>. Sinh năm: ……………………………………</p> */}
                        </div>
                        {/* <p>
                            Chứng minh nhân dân số: … Ngày cấp: …/…/…. Nơi cấp:
                            ………………………
                        </p>
                        <p>Thường trú: …………………………………………………………………………</p> */}

                        <h4>ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG</h4>
                        <div className="flex items-center gap-3">
                            <p>
                                Bên B đồng ý góp vốn cho Bên A và cùng với đối
                                tác của Bên A để đầu tư vào sản phẩm:
                                <MySelect
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="product_id"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    options={product}
                                    errors={errors}
                                    validate={VALIDATE}
                                    required={KEY_REQUIRED}
                                    itemsPerPage={5} // Adjust items per page as needed
                                    disabled={isView}
                                    placeholder="Chọn"
                                />
                            </p>
                        </div>

                        <h4>
                            ĐIỀU 2: TỔNG GIÁ TRỊ VỐN GÓP VÀ PHƯƠNG THỨC GÓP VỐN
                        </h4>
                        <p>
                            Tổng giá trị vốn góp Bên A và Bên B góp để thực hiện
                            nội dung nêu tại Điều 1 là: …
                        </p>
                        <p className="flex items-center gap-3">
                            Nay Bên B góp vốn cho Bên A với số tiền:{" "}
                            <CurrencyInput
                                name="capital"
                                handleChange={handleOnchangeCurrency}
                                values={formData}
                                errors={errors}
                                validate={VALIDATE}
                                required={KEY_REQUIRED}
                                configUI={{ width: "calc(50% - 12px)" }}
                                disabled={isView}
                            />
                        </p>
                        <p className="flex items-center gap-3">
                            Trong thời gian:{" "}
                            <MyTextField
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="duration"
                                placeholder="Nhập"
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE}
                                unit="Tháng"
                                max={100}
                                min={0}
                                type="number"
                                disabled={isView}
                            />
                        </p>

                        <h4>ĐIỀU 3: PHÂN CHIA LỢI NHUẬN VÀ THUA LỖ</h4>
                        <p>
                            Lợi nhuận được hiểu là khoản tiền còn dư ra sau khi
                            trừ đi các chi phí cho việc đầu tư, quản lý tài sản
                            góp vốn.
                        </p>
                        <p>Lợi nhuận được phân chia theo tỷ lệ sau:</p>
                        <ul>
                            <li>
                                Bên A được hưởng …% lợi nhuận trong tổng giá trị
                                lợi nhuận thu được từ tài sản góp vốn.
                            </li>
                            <li>
                                Bên B được hưởng …% lợi nhuận trong tổng giá trị
                                lợi nhuận thu được từ tài sản góp vốn.
                            </li>
                            <li>
                                Lợi nhuận chỉ được chia khi trừ hết mọi chi phí
                                mà vẫn còn lợi nhuận. Nếu kinh doanh thua lỗ thì
                                các bên có trách nhiệm chịu lỗ theo phần vốn góp
                                của mình tương tự như phân chia lợi nhuận.
                            </li>
                            <li>
                                Trường hợp các bên cần huy động vốn thêm từ Ngân
                                hàng để đầu tư thực hiện dự án trên đất thì số
                                lãi phải đóng cho Ngân hàng cũng được chia theo
                                tỷ lệ vốn góp.
                            </li>
                        </ul>

                        <h4>ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA BÊN A</h4>
                        <p>4.1 Quyền của Bên A:</p>
                        <ul>
                            <li>
                                Yêu cầu Bên B góp vốn đúng thời điểm và số tiền
                                theo thỏa thuận trong hợp đồng này.
                            </li>
                            <li>
                                Được quyền đơn phương chấm dứt thực hiện hợp
                                đồng trong trường hợp Bên B không góp đủ vốn
                                hoặc góp vốn không đúng thời hạn.
                            </li>
                            <li>
                                Được hưởng lợi nhuận tương đương với phần vốn
                                góp của mình.
                            </li>
                            <li>
                                Yêu cầu Bên B thanh toán lỗ trong trường hợp có
                                thua lỗ.
                            </li>
                            <li>
                                Ưu tiên nhận chuyển nhượng phần vốn góp trong
                                trường hợp Bên B có nhu cầu chuyển nhượng phần
                                vốn góp.
                            </li>
                            <li>
                                Các quyền khác theo Hợp đồng này hoặc do pháp
                                luật quy định.
                            </li>
                        </ul>

                        <p>4.2 Nghĩa vụ của Bên A:</p>
                        <ul>
                            <li>
                                Trả lại số tiền tương đương với phần vốn góp của
                                Bên B cho Bên B trong trường hợp đơn phương chấm
                                dứt hợp đồng.
                            </li>
                            <li>
                                Báo cáo việc thay đổi, bổ sung thành viên góp
                                vốn cho Bên B.
                            </li>
                            <li>
                                Thông báo cho Bên B về việc đầu tư, xây dựng,
                                khai thác tài sản góp vốn.
                            </li>
                            <li>
                                Hỗ trợ cho Bên B để thực hiện các giao dịch
                                chuyển nhượng phần vốn góp này khi có yêu cầu từ
                                Bên B hoặc bên thứ ba;
                            </li>
                            <li>
                                Các nghĩa vụ khác theo Hợp đồng này hoặc do pháp
                                luật quy định.
                            </li>
                        </ul>

                        <h4>ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA BÊN B</h4>
                        <p>5.1 Quyền của Bên B:</p>
                        <ul>
                            <li>
                                Được hưởng lợi nhuận tương đương với phần vốn
                                góp của mình.
                            </li>
                            <li>
                                Yêu cầu Bên A cùng thanh toán lỗ trong trường
                                hợp có thua lỗ.
                            </li>
                            <li>
                                Chuyển nhượng phần vốn góp cho Bên thứ ba nếu
                                được Bên A đồng ý bằng văn bản.
                            </li>
                            <li>
                                Được quyền đơn phương chấm dứt thực hiện hợp
                                đồng trong trường hợp Bên A không thanh toán lợi
                                nhuận cho mình hoặc vi phạm nghĩa vụ của mình
                                theo quy định tại Điều 4.2.
                            </li>
                            <li>
                                Ưu tiên nhận chuyển nhượng phần vốn góp trong
                                trường hợp Bên A có nhu cầu chuyển nhượng phần
                                vốn góp.
                            </li>
                        </ul>

                        <p>5.2 Nghĩa vụ của Bên B:</p>
                        <ul>
                            <li>
                                Góp vốn vào đúng thời điểm và giá trị theo các
                                thỏa thuận của Hợp đồng này.
                            </li>
                            <li>
                                Chịu lỗ tương ứng với phần vốn góp của mình.
                            </li>
                            <li>
                                Hỗ trợ cho Bên A để thực hiện các giao dịch liên
                                quan đến phần vốn góp nếu Bên A có yêu cầu.
                            </li>
                            <li>
                                Thông báo trước 01 tháng cho Bên A biết việc
                                chuyển nhượng phần vốn góp của mình cho Bên thứ
                                ba.
                            </li>
                            <li>
                                Các nghĩa vụ khác theo Hợp đồng này hoặc do pháp
                                luật quy định.
                            </li>
                        </ul>

                        <h4>ĐIỀU 6: CHUYỂN NHƯỢNG HỢP ĐỒNG</h4>
                        <p>
                            Trong quá trình thực hiện hợp đồng này, Bên B có
                            quyền đề nghị chuyển nhượng toàn bộ quyền và nghĩa
                            vụ của hợp đồng này cho bên thứ ba. Đề nghị chuyển
                            nhượng phải được lập thành văn bản và được sự chấp
                            thuận của Bên A.
                        </p>

                        <h4>ĐIỀU 7: ĐIỀU KHOẢN CUỐI</h4>
                        <p>
                            Các bên cam kết thực hiện đúng và đầy đủ các thỏa
                            thuận tại Hợp đồng này.
                        </p>

                        <h4>ĐIỀU 8: HIỆU LỰC CỦA HỢP ĐỒNG</h4>
                        <p>
                            Hợp đồng này có hiệu lực từ ngày ký và có giá trị
                            pháp lý cho đến khi các bên hoàn thành nghĩa vụ của
                            mình.
                        </p>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 50,
                            }}
                        >
                            <div>
                                <p>BÊN A</p>
                                <p>(Ký và ghi rõ họ tên)</p>
                            </div>
                            <div>
                                <p>BÊN B</p>
                                <p>(Ký và ghi rõ họ tên)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ActionsEditPage actions={actions} isView={isView} />
        </>
    );
}
