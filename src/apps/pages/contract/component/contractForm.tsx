import { Stack, Typography } from "@mui/material";

type ContractFormProps = {
    data?: any;
};
const ContractForm: React.FC<ContractFormProps> = ({ data }) => {
    console.log("first,", data?.user?.firstName, data);
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                padding: "12px 16px",
                width: "100%",
            }}
        >
            <div>
                <h3 className=" p-2 text-center">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </h3>
                <h3 className="p-2 text-center">Độc lập - Tự do - Hạnh phúc</h3>
                <h2 className="p-2 text-center">HỢP ĐỒNG GIAO DỊCH SẢN PHẨM</h2>
                <p className="p-2 text-center">Số: ........../HDKQ/HYRACAP</p>
                <ul className="p-2 items-center">
                    <li>
                        Căn cứ bộ luật Dân sự ban hành ngày 24 tháng 11 năm
                        2015;
                    </li>
                    <li>
                        Căn cứ Luật chứng khoán 2019 và các thông tư hướng dẫn
                        thi hành;
                    </li>
                    <li>Căn cứ các văn bản pháp luật hiện hành.</li>
                </ul>
                <h3>A. TÊN KHÁCH HÀNG/NHÀ ĐẦU TƯ</h3>
                <div>
                    <p>
                        Họ và Tên khách hàng(Ông/Bà): ..{" "}
                        <strong>{data?.user?.firstName || "..."}</strong>{" "}
                        <strong>{data?.user?.lastName || "..."}</strong>...
                    </p>
                    <p>
                        Số CMND: ...
                        <strong>
                            {data?.user?.idInformation?.idNumber || "..."}
                        </strong>
                        ........ Cấp ngày:....
                        <strong>
                            {data?.user?.idInformation?.date_of_issue || "..."}
                        </strong>
                        ....
                    </p>
                    <p>
                        Tại: .......
                        <strong>
                            {data?.user?.idInformation
                                ? data?.user?.idInformation.place_of_issue
                                : "..."}
                        </strong>
                        ...........
                    </p>
                    <p>
                        Địa chỉ thường trú: ....
                        <strong>
                            {data?.user?.idInformation?.address || "..."}
                        </strong>
                        ........
                    </p>
                    <p>
                        Điện thoại: ...........<strong>{data?.phone}</strong>
                        .......................... Email: ................
                        <strong>{data?.email || "..."}</strong>
                        .................................
                    </p>
                    <p>Số tài khoản giao dịch : ....................</p>
                    <p>
                        Tên gói: ...
                        <strong>{data?.product_id?.name || "..."}</strong>
                        ....
                    </p>
                    <p>
                        Số tiền đầu tư: ...
                        <strong>{data?.capital || "..."}</strong>....
                    </p>
                    <p>
                        Kỳ hạn: ............
                        <strong>{data?.duration || "..."}</strong> tháng
                    </p>
                </div>

                <h3>B. CÔNG TY CỔ PHẦN ĐẦU TƯ HYRACAP</h3>
                <div>
                    <p>
                        Giấy ĐKKD số: 37/QĐ – UBCK do Ủy ban Chứng khoán Nhà
                        nước cấp ngày 21/12/2006
                    </p>
                    <p>
                        Trụ sở: Lô CX01, Khu đô thị Văn Khê, Hà Đông, Hà Nội,
                        Việt Nam
                    </p>
                    <p>Điện thoại: 024 3573 0200 - Fax: 024 3577 1966</p>

                    <p>
                        Tài khoản số: <b>122.10.00.02328.65</b> Tại Ngân hàng
                        Đầu tư và PT Việt Nam – BIDV CN Hà Thành
                    </p>
                    <p>
                        Đại diện theo pháp luật: <b>Ông Trần Nam Chung</b> –
                        Chức vụ: <b>Chủ Tịch</b>
                    </p>

                    <h3>Điều 1: Giải thích từ ngữ</h3>
                    <p>
                        Trong Hợp đồng này, các từ hoặc cụm từ dưới đây sẽ được
                        hiểu theo một nghĩa thống nhất như sau:
                    </p>
                    <ul>
                        <li>
                            <b>“Tài khoản giao dịch ký quỹ - TKKQ”</b> là tài
                            khoản do HYRACAP mở cho Khách hàng trên cơ sở Hợp
                            đồng giao dịch ký quỹ, để ghi nhận các giao dịch vay
                            mua chứng khoán.
                        </li>
                        <li>
                            <b>“Danh mục”</b> là danh mục chứng khoán của Khách
                            hàng có trong tài khoản Khách hàng (là số dư chứng
                            khoán) tại HYRACAP mà khách hàng được phép mua và
                            HYRACAP nhận làm tài sản đảm bảo.
                        </li>
                        <li>
                            <b>“Tài sản đảm bảo – TSĐB”</b> là toàn bộ tài sản
                            có trong Tài khoản Giao dịch ký quỹ của Khách hàng
                            bao gồm: tiền mặt; chứng khoán hiện có hoặc đang chờ
                            về; cổ tức đang chờ về; quyền mua cổ phiếu/trái
                            phiếu…
                        </li>
                        <li>
                            <b>“Tổng dư nợ vay”</b> là tổng dư nợ (gốc, lãi,
                            phí) mà Khách hàng đã vay của HYRACAP để giao dịch
                            ký quỹ vay mua chứng khoán, được thể hiện bằng số dư
                            âm tiền trên tài khoản của Khách hàng.
                        </li>
                        <li>
                            <b>“Hạn mức tài trợ - HMTT”</b> là hạn mức cho vay
                            tối đa đối với từng Khách hàng do HYRACAP quy định,
                            và được áp dụng đối với mỗi Khách hàng khác nhau.
                        </li>
                        <li>
                            <b>“Gọi ký quỹ duy trì”</b> là việc gọi nộp tiền của
                            HYRACAP vào bất kỳ thời điểm nào khi tài sản của
                            Khách hàng bị sụt giảm (có thể do các nguyên nhân từ
                            tổ chức phát hành: trả cổ tức, phát hành thêm,
                            thưởng cổ phiếu, chốt quyền…) hoặc do lệnh mua vượt
                            giá trị được phép vay theo quy định của Hợp đồng
                            này, ngay lập tức Khách hàng phải ký quỹ thêm tiền
                            hoặc bán bớt chứng khoán để đảm bảo tỷ lệ ký quỹ ban
                            đầu hay duy trì tối thiểu.
                        </li>
                    </ul>

                    <h3>Điều 2: Giao dịch ký quỹ</h3>
                    <p>
                        HYRACAP, ngay sau khi ký hợp đồng, mở tài khoản giao
                        dịch và nhận ký quỹ ban đầu của Khách hàng theo quy định
                        tại hợp đồng, sẽ cam kết thay mặt Khách hàng thực hiện
                        các nghĩa vụ thanh toán đối với giao dịch chứng khoán do
                        Khách hàng thực hiện và được HYRACAP chấp nhận phù hợp
                        với các điều khoản và điều kiện của Hợp đồng. Khách
                        hàng, tại đây, đồng ý và ủy quyền HYRACAP thay mặt Khách
                        hàng thực hiện các nghĩa vụ thanh toán này.
                    </p>

                    <h3>Điều 3: Mở tài khoản</h3>
                    <p>
                        <b>
                            3.1 Mở và sử dụng tài khoản giao dịch ký quỹ chứng
                            khoán:
                        </b>{" "}
                        Để thực hiện các giao dịch ký quỹ chứng khoán với
                        HYRACAP và được cấp HMTT theo đúng quy định của hợp đồng
                        này, Khách hàng phải duy trì đúng/đầy đủ tài khoản giao
                        dịch ký quỹ tại HYRACAP số ………………………..
                    </p>
                    <p>
                        - Là tài khoản chuyên dùng để giao dịch chứng khoán,
                        thực hiện các giao dịch mua/bán chứng khoán,n, thực hiện
                        các giao dịch mua/ bán chứng khoán, phí, chi phí khác
                        (nếu có) liên quan đến việc mua bán chứng khoán với
                        HYRACAP và các giao dịch khác theo quy định tại Hợp đồng
                        này;
                    </p>
                    <h3>Điều 3: Mở tài khoản</h3>
                    <p>
                        - Tài khoản này không được phép: chuyển khoản tiền/rút
                        tiền, chuyển khoản/cho tặng chứng khoán, cầm cố chứng
                        khoán khi đang còn nợ tiền của HYRACAP, trừ trường hợp
                        HYRACAP cho phép bằng văn bản.
                    </p>
                    <h4>3.2 Quản lý tài khoản</h4>
                    <p>Bằng hợp đồng này Khách hàng ủy quyền cho HYRACAP:</p>
                    <ul>
                        <li>
                            Ủy quyền này không được hủy ngang cho đến khi Khách
                            hàng hoàn thành nghĩa vụ cho HYRACAP và chính thức
                            thanh lý Hợp đồng mở tài khoản giao dịch ký quỹ;
                        </li>
                        <li>
                            Cung cấp thông tin liên quan đến tài khoản theo quy
                            định của pháp luật;
                        </li>
                        <li>
                            Hai bên cùng thống nhất xử lý TSĐB để thu hồi nợ khi
                            Khách hàng vi phạm hợp đồng này;
                        </li>
                        <li>
                            Thay mặt Khách hàng xử lý TSĐB để thu hồi nợ, các
                            chi phí phát sinh liên quan và bất cứ nghĩa vụ tài
                            chính nào cho HYRACAP khi khách hàng vi phạm quy
                            định Hợp đồng.
                        </li>
                        <li>
                            Thay mặt Khách hàng trích nộp các khoản thuế theo
                            quy định của pháp luật, giữ lại chứng khoán/tiền của
                            Khách hàng để thực hiện nộp thuế;
                        </li>
                    </ul>

                    <h3>Điều 4: Điều kiện được phép vay giao dịch ký quỹ</h3>
                    <p>
                        Khách hàng được phép giao dịch ký quỹ sau khi đã ký hợp
                        đồng này với HYRACAP và đáp ứng các điều kiện sau đây:
                    </p>
                    <ul>
                        <li>
                            Khách hàng đáp ứng các điều kiện theo quy định của
                            về chứng khoán và thị trường chứng khoán.
                        </li>
                        <li>
                            Khách hàng phải duy trì 1 khoản ký quỹ ban đầu tối
                            thiểu theo quy định của HYRACAP (giá trị tài sản đảm
                            bảo, loại tài sản đảm bảo,…) theo Phụ lục của Hợp
                            đồng này. Ký quỹ ban đầu và quy định về bảo đảm tiền
                            vay có thể thay đổi theo từng thời kỳ theo các quyết
                            định của HYRACAP.
                        </li>
                        <li>
                            Chứng khoán Khách hàng mua nằm trong Danh mục của
                            HYRACAP cho phép giao dịch ký quỹ.
                        </li>
                        <li>Các điều kiện và thông báo khác của HYRACAP.</li>
                    </ul>

                    <h3>Điều 5: Cho vay</h3>
                    <h4>5.1 Nguyên tắc cho vay:</h4>
                    <ul>
                        <li>
                            Khách hàng có thể được cho vay trong hạn mức tài trợ
                            (HMTT) một hoặc nhiều lần để thực hiện các giao dịch
                            mua/bán . Trong thời hạn HMTT, Khách hàng có thể trả
                            nợ vay và tiếp tục vay lại nhưng tổng dư nợ của các
                            khoản giải ngân tại mọi thời điểm không vượt quá giá
                            trị HMTT nêu tại Phụ lục của Hợp đồng này.
                        </li>
                        <li>
                            Trong trường hợp Khách hàng giao dịch vượt hạn mức
                            tài trợ hoặc vượt quá TSĐB thì Khách hàng phải ký
                            quỹ thanh toán phần vượt ngay trong ngày. Nếu phần
                            vượt HMTT nằm trong TSĐB thì Khách hàng có thể đề
                            nghị HYRACAP nâng HMTT nếu được chấp thuận thì Khách
                            hàng không phải ký quỹ phần vượt.
                        </li>
                        <li>
                            Trong thời hạn hiệu lực của hạn mức nếu Khách hàng
                            không đủ số dư tiền trên tài khoản để thực hiện các
                            giao dịch đầu tư đã được giao dịch trong ngày với
                            HYRACAP (bao gồm cả phí giao dịch), Khách hàng ủy
                            quyền và yêu cầu HYRACAP tự động giải ngân tiền vay
                            theo nguyên tắc dưới đây:
                            <ul>
                                <li>
                                    Căn cứ vào phiếu yêu cầu đầu tư sản phẩm của
                                    Khách hàng trên phiếu lệnh và các giao dịch
                                    bằng điện tử khác mà HYRACAP chấp nhận và
                                    giao dịch thành công, HYRACAP chuyển tiền
                                    giải ngân vào tài khoản của Khách hàng được
                                    thể hiện bằng bút toán âm tiền trên tài
                                    khoản của Khách hàng.
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </Stack>
    );
};
export default ContractForm;
