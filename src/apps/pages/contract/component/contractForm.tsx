import { formatDate } from "@/utils/date-time";
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
                padding: "12px 48px",
                width: "100%",
            }}
        >
            <div>
                <div>
                    <h3 className=" p-2 text-center">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </h3>
                    <h3 className="p-2 text-center">
                        Độc lập - Tự do - Hạnh phúc
                    </h3>
                    <h2 className="p-2 text-center">
                        HỢP ĐỒNG GIAO DỊCH SẢN PHẨM
                    </h2>
                    <p className="p-2 text-center">
                        Số: ........../HDKQ/HYRACAP
                    </p>
                    <div className="pl-4">
                        <ul className="p-2 items-center italic">
                            <li>
                                Căn cứ bộ luật Dân sự ban hành ngày 24 tháng 11
                                năm 2015;
                            </li>
                            <li>
                                Căn cứ Luật chứng khoán 2019 và các thông tư
                                hướng dẫn thi hành;
                            </li>
                            <li>Căn cứ các văn bản pháp luật hiện hành.</li>
                        </ul>
                    </div>
                </div>
                <div className="py-4">
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
                                {formatDate(
                                    data?.user?.idInformation?.date_of_issue,
                                    "DDMMYYYY"
                                ) || "..."}
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
                            Điện thoại: ...........
                            <strong>{data?.phone}</strong>
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
                </div>

                <h3 className="py-4">B. CÔNG TY CỔ PHẦN ĐẦU TƯ HYRACAP</h3>
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
                    <ol style={{ listStylePosition: "inside" }}>
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
                    </ol>

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
                    <ol style={{ listStylePosition: "inside" }}>
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
                    </ol>

                    <h3>Điều 4: Điều kiện được phép vay giao dịch ký quỹ</h3>
                    <p>
                        Khách hàng được phép giao dịch ký quỹ sau khi đã ký hợp
                        đồng này với HYRACAP và đáp ứng các điều kiện sau đây:
                    </p>
                    <ol style={{ listStylePosition: "inside" }}>
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
                    </ol>

                    <h3>Điều 5: Cho vay</h3>
                    <h4>5.1 Nguyên tắc cho vay:</h4>
                    <ol style={{ listStylePosition: "inside" }}>
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
                    </ol>
                </div>

                <h3>ĐIỀU KHOẢN VÀ QUY ĐỊNH CỦA HYRACAP</h3>

                <div>
                    <h4>Điều 5: Giải ngân</h4>
                    <p>
                        Đồng thời khách hàng theo đây ủy quyền cho HYRACAP thực
                        hiện việc giải ngân từ Tài khoản của HYRACAP vào Tài
                        khoản của Khách hàng mở tại HYRACAP để thanh toán các
                        giao dịch mua/bán đầu tư. Đây là bằng chứng yêu cầu
                        thanh toán cho các giao dịch và xác nhận HYRACAP đã giải
                        ngân để thanh toán theo yêu cầu của khách hàng.
                    </p>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            Khách hàng đương nhiên nhận nợ vay và có nghĩa vụ
                            thanh toán toàn bộ số tiền HYRACAP đã giải ngân.
                        </li>
                        <li>
                            Khoản nợ được thể hiện bằng bút toán âm tiền lũy kế
                            trên tài khoản của Khách hàng.
                        </li>
                        <li>
                            Khách hàng ủy quyền cho HYRACAP lập văn bản xác nhận
                            khoản nợ vay và lưu trong hồ sơ khách hàng.
                        </li>
                    </ol>
                </div>

                <section>
                    <h4>Điều 5.2: Phương thức giải ngân</h4>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            Khi lệnh mua đầu tư được khớp, khách hàng ủy quyền
                            cho HYRACAP giải ngân số tiền vay tự động.
                        </li>
                        <li>
                            Khách hàng cam kết không khiếu nại, tranh chấp về
                            phương thức, thủ tục giải ngân.
                        </li>
                    </ol>
                </section>

                <section>
                    <h3>Điều 6: Trả nợ gốc, lãi vay</h3>
                    <h4>6.1. Trả nợ gốc</h4>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            Khách hàng có thể bán đầu tư hoặc nộp thêm tiền vào
                            tài khoản để trả nợ.
                        </li>
                        <li>
                            HYRACAP tự động tính toán, xác định lãi và trích
                            tiền từ tài khoản của Khách hàng để thu nợ.
                        </li>
                    </ol>
                    <h4>6.2. Hết hạn hiệu lực</h4>
                    <p>
                        HYRACAP và Khách hàng thỏa thuận cấp hạn mức tài trợ
                        mới. Khách hàng phải thanh toán toàn bộ dư nợ trước khi
                        cấp hạn mức mới.
                    </p>
                    <h4>6.3. Chuyển nợ quá hạn</h4>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            HYRACAP chuyển nợ gốc không thanh toán đúng hạn sang
                            nợ quá hạn.
                        </li>
                        <li>
                            Lãi suất quá hạn áp dụng từ ngày liền sau thời điểm
                            chuyển quá hạn.
                        </li>
                    </ol>
                </section>

                <section>
                    <h3>Điều 7: Thế chấp đầu tư</h3>
                    <p>
                        Khách hàng thế chấp đầu tư và đồng ý cầm cố toàn bộ số
                        đầu tư có trong tài khoản để đảm bảo thanh toán các
                        khoản vay, lãi vay và các khoản phải trả khác.
                    </p>
                </section>

                <section>
                    <h3>Điều 8: Quyền và nghĩa vụ của các bên</h3>
                    <h4>8.1. Quyền và nghĩa vụ của Khách hàng</h4>
                    <p>
                        Khách hàng chịu trách nhiệm thực hiện các nghĩa vụ liên
                        quan đến hợp đồng với HYRACAP.
                    </p>
                </section>

                <h5>8.1.1 Quyền của Khách hàng</h5>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        Yêu cầu HYRACAP thực hiện cấp HMTT theo đúng các nội
                        dung quy định trong hợp đồng này.
                    </li>
                    <li>
                        Chấm dứt hợp đồng trước thời hạn với điều kiện đã thanh
                        toán mọi khoản nợ với HYRACAP.
                    </li>
                </ol>

                <h5>8.1.2 Nghĩa vụ của Khách hàng</h5>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        Cung cấp đầy đủ, trung thực các thông tin, tài liệu liên
                        quan đến việc vay vốn và chịu trách nhiệm về tính chính
                        xác của các thông tin, tài liệu đã cung cấp; đồng thời
                        tạo mọi điều kiện thuận lợi và không làm bất cứ điều gì
                        khó khăn trở ngại trong trường hợp HYRACAP phải xử lý
                        TSĐB theo quy định tại Phụ lục của Hợp đồng.
                    </li>
                    <li>
                        Nhận nợ vô điều kiện với các khoản tiền vay được HYRACAP
                        tự động giải ngân trên tài khoản Khách hàng (không cần
                        có chữ ký của Khách hàng) để thanh toán cho các giao
                        dịch đã thành công trong ngày tại HYRACAP.
                    </li>
                    <li>
                        Trong trường hợp HYRACAP đồng ý cho Khách hàng được phép
                        rút/chuyển khoản tiền trên TKKQ của Khách hàng, Khách
                        hàng cam kết nhận nợ vô điều kiện đối với khoản nợ này,
                        và khoản nợ này cũng được xem là khoản vay của Khách
                        hàng và được cộng vào thành dư nợ lũy kế.
                    </li>
                    <li>
                        Chủ động theo dõi biến động giá đầu tư trên thị trường
                        hàng ngày, chủ động bổ sung TSĐB, trả bớt nợ vay, yêu
                        cầu HYRACAP xử lý một phần hoặc toàn bộ TSĐB để đảm bảo
                        duy trì tỷ lệ tài trợ (Rtt) luôn đạt tỷ lệ quy định của
                        HYRACAP.
                    </li>
                    <li>
                        Trong thời gian cầm cố TSĐB, không được phép chuyển
                        nhượng, không được cầm cố TSĐB cho bên thứ ba, không
                        chuyển giao cho tặng đầu tư, không rút tiền gốc, lãi,
                        không thực hiện bất cứ quyền nào phát sinh từ TSĐB không
                        đúng với các thỏa thuận tại Hợp đồng này, không xâm phạm
                        đến TSĐB hoặc sử dụng các biện pháp khác để rút tiền từ
                        TSĐB không đúng với các thỏa thuận tại Hợp đồng này.
                    </li>
                    <li>
                        Bổ sung TSĐB theo quy định của HYRACAP trong trường hợp
                        TSĐB của Khách hàng bị giảm sút giá trị theo đánh giá
                        của HYRACAP.
                    </li>
                    <li>
                        Trả nợ (gốc và lãi), phí, chi phí, thuế và các khoản đến
                        hạn khác (nếu có) đầy đủ cho HYRACAP hoặc Bên nhận
                        chuyển nhượng. Trường hợp không trả nợ gốc, lãi vay và
                        phí, chi phí, thuế đúng hạn, khách hàng phải trả lãi cho
                        số tiền chậm thanh toán theo lãi suất quá hạn theo đúng
                        quy định tại Hợp đồng này.
                    </li>
                    <li>
                        Số tiền thu được từ việc xử lý tài sản đảm bảo sau khi
                        đã thanh toán xong các khoản nêu tại Điều 6 nêu trên,
                        nếu thừa sẽ được trả lại cho Khách hàng, nếu thiếu thì
                        Khách hàng vẫn phải tiếp tục thực hiện nghĩa vụ trả nợ
                        số tiền còn lại theo quy định và HYRACAP có quyền bán
                        bất kỳ đầu tư nào thuộc tài khoản đối ứng của Khách hàng
                        mà không thuộc diện trong tài sản đảm bảo theo phương
                        thức được quy định tại điểm 3.4 của Phụ lục Hợp đồng
                        này.
                    </li>
                    <li>
                        Cam kết vô điều kiện cùng mọi nguồn thu và tài sản của
                        Khách hàng để trả đủ nợ gốc và tiền lãi vay, phí, chi
                        phí, thuế và các khoản nợ đến hạn khác (nếu có) cho
                        HYRACAP hoặc bên nhận chuyển nhượng; đồng thời đồng ý để
                        HYRACAP tự động phong tỏa tài khoản và trích tài khoản
                        của Khách hàng mở tại HYRACAP để trích tiền thu hồi các
                        khoản nợ gốc, lãi, phí, phạt, bồi thường thiệt hại cho
                        HYRACAP.
                    </li>
                    <li>
                        Ủy quyền cho HYRACAP toàn quyền xử lý TSĐB để thu hồi nợ
                        cho HYRACAP khi tỷ lệ tài trợ (Rtt) bằng hoặc lớn hơn Tỷ
                        lệ xử lý. HYRACAP có quyền phối hợp hoặc ủy quyền lại
                        cho bên thứ ba thay mặt HYRACAP xử lý TSĐB.
                    </li>
                    <li>
                        Bồi thường cho HYRACAP tất cả các thiệt hại nếu thiệt
                        hại đó là do Khách hàng gây nên.
                    </li>
                    <li>
                        Tự chịu trách nhiệm về các khoản thuế và nghĩa vụ tài
                        chính khác theo quy định của pháp luật.
                    </li>
                </ol>
                <h5>8.1.3 Cam kết của Khách hàng</h5>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        - Thực hiện các quyền và nghĩa vụ theo hợp đồng này, các
                        văn bản, cam kết vay vốn liên quan theo quy định của
                        pháp luật;
                    </li>
                    <li>
                        - Khách hàng đã đọc và thông hiểu quy định về giao dịch
                        ký quỹ quy định tại Hợp đồng và Phụ lục hợp đồng này;
                    </li>
                    <li>
                        - Khách hàng có đủ thẩm quyền cần thiết để ký kết hợp
                        đồng và tuân thủ và thực hiện các nghĩa vụ được quy định
                        tại hợp đồng này;
                    </li>
                    <li>
                        - Khách hàng phải tuân thủ và thực hiện đúng, đầy đủ các
                        điều khoản và điều kiện quy định tại Hợp đồng này;
                    </li>
                    <li>
                        - Trường hợp xảy ra tranh chấp giữa Khách hàng và bên
                        nhận ủy quyền giao dịch của Khách hàng, Khách hàng và
                        bên nhận ủy quyền cam kết và đảm bảo không yêu cầu
                        HYRACAP phải tham gia vào quá trình giải quyết tranh
                        chấp dù trong bất kỳ trường hợp nào. Nếu HYRACAP phải
                        tham gia theo yêu cầu của Tòa án thì Khách hàng và bên
                        nhận ủy quyền sẽ liên đới chịu các tổn phí của HYRACAP
                        để tham gia.
                    </li>
                </ol>

                <h4>8.2. Quyền và nghĩa vụ của HYRACAP</h4>
                <h5>8.2.1. Quyền của HYRACAP</h5>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        - Từ chối giải ngân nếu Khách hàng không đáp ứng đủ các
                        điều kiện giải ngân, điều kiện về TSĐB, các tỷ lệ ký quỹ
                        và hoặc các điều kiện khác theo quy định của Hợp đồng
                        này;
                    </li>
                    <li>
                        - Được quyền cấp hệ số cho vay đối với các Khách hàng
                        của HYRACAP;
                    </li>
                    <li>
                        - Xác định lại, điều chỉnh và/hoặc chấm dứt hiệu lực
                        HMTT đã cấp cho Khách hàng;
                    </li>
                    <li>
                        - Đơn phương xác định lại, điều chỉnh lại các tỷ lệ cho
                        vay đối với bất kỳ loại đầu tư nào mà không cần phải
                        thông báo trước;
                    </li>
                    <li>
                        - Đơn phương thay đổi lãi suất cho vay, thay đổi cách
                        thức tính lãi theo Phụ lục của Hợp đồng mà không phải
                        thông báo trước;
                    </li>
                    <li>
                        - Tự động ghi nợ, ghi có đối với các tài khoản của Khách
                        hàng tại HYRACAP: chuyển tiền thanh toán cho các giao
                        dịch mua, bán, thanh toán phí của Khách hàng tại HYRACAP
                        để thực hiện các giao dịch theo Hợp đồng này. Tự động
                        đóng tài khoản Giao dịch ký quỹ khi khách hàng không
                        thực hiện các giao dịch theo hợp đồng này trong thời hạn
                        của HMTT hoặc hết thời hạn của HMTT mà khách hàng không
                        được cấp HMTT mới;
                    </li>
                    <li>
                        - Thực hiện các giao dịch khác theo ủy quyền của Khách
                        hàng và/hoặc thỏa thuận khác tại Hợp đồng này;
                    </li>
                    <li>
                        - Khi các khoản vay của Khách hàng đến hạn trả nợ hoặc
                        phải trả nợ trước hạn theo quy định tại hợp đồng,
                        HYRACAP được quyền tự động trích tài khoản của Khách
                        hàng và HYRACAP hoặc bất kỳ tài khoản được ủy quyền giao
                        dịch nào của Khách hàng;
                    </li>
                    <li>
                        - Được quyền yêu cầu Khách hàng sử dụng mọi tài sản và
                        nguồn thu khác của Khách hàng để trả nợ gốc và lãi trong
                        trường hợp TSĐB hoặc bảo lãnh không đủ để trả nợ gốc và
                        lãi cho HYRACAP;
                    </li>
                    <li>
                        - Được quyền xử lý TSĐB theo quy định tại Hợp đồng này,
                        yêu cầu Khách hàng thực hiện nghĩa vụ trả nợ cho
                        HYRACAP;
                    </li>
                    <li>
                        - Được quyền thu hồi nợ trước hạn khi xảy ra các sự kiện
                        quy định tại Điều 10 Hợp đồng này;
                    </li>
                    <li>
                        - Không cần sự chấp thuận của Khách hàng, HYRACAP được
                        toàn quyền chuyển giao hoặc chuyển nhượng cho bên thứ 3
                        (gọi tắt là bên nhận chuyển nhượng) thực hiện toàn bộ
                        hoặc một phần các quyền lợi và nghĩa vụ của HYRACAP theo
                        quy định trong bản hợp đồng này và các hợp đồng, phụ
                        lục.
                    </li>
                </ol>
                <h5>Điều 8.2.1: Quyền của HYRACAP</h5>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        HYRACAP có quyền đòi các khoản nợ gốc, thụ hưởng tiền
                        lãi phát sinh, nợ quá hạn, nợ lãi quá hạn và các chi phí
                        khác (nếu có). Trong trường hợp này, HYRACAP có nghĩa vụ
                        phải thông báo cho Khách hàng bằng văn bản.
                    </li>
                    <li>
                        Trong trường hợp HYRACAP đã xử lý tài sản đảm bảo theo
                        điểm 3.4 nhưng không đủ thu nợ gốc, lãi vay và các chi
                        phí khác, HYRACAP có quyền yêu cầu Khách hàng trả số nợ
                        còn thiếu và khởi kiện Khách hàng để truy đòi số nợ còn
                        thiếu.
                    </li>
                    <li>
                        Được quyền thu phí liên quan đến việc cho vay và/hoặc
                        các khoản phí khác theo HYRACAP quy định trong từng thời
                        kỳ phù hợp với pháp luật và thỏa thuận tại Hợp đồng này.
                    </li>
                    <li>
                        HYRACAP có quyền gửi nội dung Thông báo liên quan đến
                        TKKQ cho chính chủ tài khoản và/hoặc người nhận ủy quyền
                        giao dịch.
                    </li>
                </ol>

                <h5>Điều 8.2.2: Nghĩa vụ của HYRACAP</h5>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        Giải ngân cho Khách hàng các khoản nằm trong HMTT theo
                        đúng quy định của Hợp đồng này.
                    </li>
                    <li>
                        Thực hiện đúng thỏa thuận trong Hợp đồng này, Phụ lục
                        Hợp đồng, văn bản thỏa thuận về việc sửa đổi, bổ sung
                        Hợp đồng và tài liệu kèm theo (nếu có).
                    </li>
                </ol>
                <h4>Điều 9: Vi phạm Hợp đồng</h4>
                <p>
                    Trường hợp Khách hàng vi phạm bất kỳ điều khoản và điều kiện
                    nào của Hợp đồng này, HYRACAP có quyền chấm dứt ngay lập tức
                    Hợp đồng này. Tuy nhiên, HYRACAP có thể, tùy theo quyết định
                    của riêng mình, lựa chọn phương án gửi thông báo cho Khách
                    hàng về thời hạn thực hiện sửa chữa vi phạm. Thời hạn yêu
                    cầu sửa chữa vi phạm quy định tại Điều này có thể được gia
                    hạn tùy vào quyết định của HYRACAP.
                </p>

                <h4>Điều 10: Hiệu lực của Hợp đồng</h4>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        Thời hạn có hiệu lực của Hợp đồng là kể từ ngày đại diện
                        hợp pháp của hai Bên ký vào Hợp đồng này.
                    </li>
                    <li>
                        Hợp đồng này chấm dứt trong các trường hợp sau:
                        <ul>
                            <li>
                                Hai Bên có thỏa thuận bằng văn bản về việc cùng
                                chấm dứt Hợp đồng.
                            </li>
                            <li>
                                Khi xảy ra vi phạm quy định tại Điều 9 hoặc khi
                                Khách hàng không thực hiện sửa chữa vi phạm
                                trong thời hạn thông báo.
                            </li>
                            <li>
                                Hết thời hạn cung cấp HMTT theo quy định tại Phụ
                                lục Hợp đồng này và Khách hàng thanh toán đầy đủ
                                nợ gốc, lãi vay, phí, và chi phí khác (nếu có).
                            </li>
                            <li>
                                Do quy định của luật pháp hiện hành hoặc quyết
                                định của Cơ quan nhà nước xác định thỏa thuận
                                của các Bên trong Hợp đồng này không được phép
                                tiến hành.
                            </li>
                            <li>
                                Có dấu hiệu Khách hàng bị phá sản, tịch thu Giấy
                                đăng ký kinh doanh và/hoặc các khó khăn lớn về
                                tài chính dẫn đến hoạt động kinh doanh bị ảnh
                                hưởng nghiêm trọng.
                            </li>
                            <li>
                                Khách hàng vi phạm quy định về tỷ lệ duy trì quy
                                định tại Phụ lục Hợp đồng mà không sửa chữa vi
                                phạm trong vòng 03 (ba) ngày kể từ ngày nhận
                                được thông báo của HYRACAP.
                            </li>
                        </ul>
                    </li>
                    <li>
                        Khi xảy ra các trường hợp trên, bằng văn bản thông báo
                        cho Khách hàng trước ba (03) ngày, HYRACAP có quyền chủ
                        động chấm dứt Hợp đồng mà không phải bồi thường bất kỳ
                        thiệt hại gì cho Khách hàng.
                    </li>
                    <li>
                        Không bị ảnh hưởng bởi việc Hợp đồng chấm dứt trước thời
                        hạn, tất cả các nghĩa vụ còn lại của Khách hàng đối với
                        HYRACAP theo Hợp đồng sẽ được bảo lưu và sẽ chỉ được xem
                        như hoàn thành khi Khách hàng thực hiện tất cả các nghĩa
                        vụ đó với HYRACAP.
                    </li>
                </ol>
                <h4>Điều 10: Thanh lý Hợp đồng</h4>
                <p>
                    Trường hợp Hợp đồng bị chấm dứt vì bất kỳ lý do gì, các bên
                    có nghĩa vụ thanh lý Hợp đồng để ghi nhận quyền và nghĩa vụ
                    còn lại của các Bên, trong vòng{" "}
                    <strong>05 (năm) ngày làm việc</strong> kể từ ngày thông
                    báo.
                </p>

                <h4>Điều 11: Thông báo</h4>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        Trong quá trình thực hiện Hợp đồng, các thông báo được
                        xem là hợp lệ nếu đã được gửi cho phía bên kia bằng:
                        <ul>
                            <li>Thư chuyển phát nhanh</li>
                            <li>Điện thoại</li>
                            <li>Tin nhắn (SMS)</li>
                            <li>Fax</li>
                            <li>
                                Email theo các thông tin của mỗi bên đã nêu tại
                                Hợp đồng này
                            </li>
                        </ul>
                    </li>
                    <li>
                        Thông báo được xem là đã nhận tại thời điểm:
                        <ul>
                            <li>Ký nhận đối với thư chuyển phát nhanh</li>
                            <li>Báo cáo đã fax thành công</li>
                            <li>Gửi thành công tin nhắn (SMS)</li>
                            <li>Lưu ghi âm đối với điện thoại</li>
                            <li>Gửi email thành công</li>
                        </ul>
                    </li>
                    <li>
                        Nếu một bên thay đổi thông tin nhận thông báo thì bên đó
                        phải cung cấp ngay cho phía bên kia. Nếu bên nhận thông
                        báo không cung cấp kịp thời thông tin nhận thông báo dẫn
                        tới thông báo bị thất lạc thì lỗi hoàn toàn thuộc về bên
                        nhận thông báo.
                    </li>
                </ol>

                <h3>
                    Thông tin liên lạc của Bên nhận Thông báo (Chủ tài
                    khoản/Người nhận ủy quyền):
                </h3>
                <p>
                    <strong>Tên cá nhân/Tên tổ chức nhận:</strong>{" "}
                    ……………………………………………………….…………….
                </p>

                <h3>Điều 12: Thực hiện Hợp đồng và Giải quyết tranh chấp</h3>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        Hai Bên cam kết cùng thực hiện nghiêm túc các thỏa thuận
                        và điều khoản của Hợp đồng này. Trong quá trình thực
                        hiện, nếu một Bên phát sinh vướng mắc, khó khăn phải
                        thông báo cho Bên kia để kịp thời giải quyết.
                    </li>
                    <li>
                        Nếu tranh chấp xảy ra mà hai Bên không thể giải quyết
                        được, các Bên thống nhất sẽ đưa vấn đề tranh chấp lên
                        Tòa án có thẩm quyền để giải quyết, và Án phí sẽ do Bên
                        thua kiện chịu.
                    </li>
                    <li>
                        Hợp đồng này được lập thành 02 (hai) bản bằng tiếng Việt
                        có giá trị pháp lý như nhau. Khách hàng giữ 01 (một)
                        bản, HYRACAP giữ 01 (một) bản để làm bằng chứng và cùng
                        thực hiện.
                    </li>
                </ol>

                <h3>Xác nhận</h3>
                <p>
                    <strong>ĐẠI DIỆN KHÁCH HÀNG</strong>Đã đọc và đồng ý với các
                    nội dung của Hợp đồng
                </p>
                <p>
                    <strong>ĐẠI DIỆN HYRACAP</strong>BÊN NHẬN ỦY QUYỀN GIAO DỊCH
                    (nếu có)Đã đọc và đồng ý với các nội dung của Hợp đồng
                </p>
                <h3>PHỤ LỤC HỢP ĐỒNG</h3>
                <p>Cách tính lãi - Tỷ lệ duy trì - Đảm bảo khoản vay</p>
                <p>
                    (Kèm theo Hợp đồng Tài trợ Giao dịch kí quỹ đầu tư ký ngày
                    tháng năm 20…..)
                </p>
                <p>
                    Phụ lục này là một phần không tách rời của Hợp đồng nhằm quy
                    định cụ thể về cách tính lãi, nguyên tắc tính toán các tỷ lệ
                    ký quỹ duy trì giao dịch, xử lý và đảm bảo khoản vay theo
                    quy định tại Hợp đồng.
                </p>

                <h3>1. Cách tính lãi, hạn mức tài trợ, lãi suất:</h3>
                <div>
                    <h4>1.1. Tiền lãi</h4>
                    <p>
                        Tiền lãi sẽ được tính trên cơ sở dư nợ thực tế/lũy kế
                        (Dn) và thời gian vay thực tế (Tv). Tiền vay được tính
                        theo ngày.
                    </p>
                    <p>
                        <strong>Lv (Lãi vay) = Dn x Tv x Ls</strong>
                    </p>
                    <p>
                        Trong đó: Ls là lãi suất cho vay thông thường do HYRACAP
                        quy định theo từng thời điểm.
                    </p>
                </div>

                <div>
                    <h4>1.2. Tiền lãi vay đến hạn</h4>
                    <p>
                        Tiền lãi vay đến hạn phải trả chưa thanh toán sẽ được
                        cộng dồn vào thành khoản dư nợ lũy kế của Khách hàng và
                        lãi vay sẽ được tính trên dư nợ lũy kế.
                    </p>
                </div>

                <div>
                    <h4>1.3. Lãi suất cho vay quá hạn</h4>
                    <p>
                        Mỗi khoản vay sẽ được áp dụng lãi suất cho vay thông
                        thường trong khoảng thời gian vay T (ngày) do HYRACAP
                        quy định theo từng thời điểm. HYRACAP bảo lưu quyền thay
                        đổi thời gian cho vay (T) vào bất kỳ thời điểm nào trong
                        thời gian hiệu lực của Hợp đồng này.
                    </p>
                    <p>
                        Các khoản vay quá hạn T (ngày) phải chịu lãi suất cho
                        vay quá hạn (Lqh). Lãi suất cho vay quá hạn có thể được
                        HYRACAP thay đổi theo từng thời điểm nhưng tối đa không
                        quá 150% Ls.
                    </p>
                </div>

                <div>
                    <h4>1.4. Thay đổi HMTT</h4>
                    <p>
                        HYRACAP được quyền thay đổi HMTT theo từng thời điểm và
                        thông báo cho khách hàng trước 3 ngày.
                    </p>
                </div>

                <div>
                    <h4>1.5. Quy định của HYRACAP</h4>
                    <p>
                        Cách tính lãi trên đây hoàn toàn do HYRACAP quy định mà
                        không cần phải có nghĩa vụ thông báo với Khách hàng.
                    </p>
                </div>

                <h3>2. Nguyên tắc tính toán và các tỷ lệ</h3>
                <div>
                    <h4>
                        2.1. Nguyên tắc tính toán khi thực hiện giao dịch ký quỹ
                    </h4>
                    <h4>2.1.1 Tài sản hiện hành (TSHH)</h4>
                    <p>
                        Là giá trị tiền và đầu tư hiện hành trên tài khoản giao
                        dịch ký quỹ của khách hàng (TKKQ) và được tính theo công
                        thức:
                    </p>
                    <p>
                        <strong>
                            TSHH = ∑(Số lượng đầu tư x Giá tham chiếu x tỷ lệ
                            định giá) + số dư tiền
                        </strong>
                    </p>
                    <p>Trong đó:</p>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            <strong>Số lượng đầu tư (SLCK)</strong>: Bao gồm đầu
                            tư hiện có và đầu tư mua chờ về.
                        </li>
                        <li>
                            <strong>Số dư tiền (trừ các khoản phí)</strong>: Là
                            số dư tiền hiện có và tiền bán đầu tư chờ về.
                        </li>
                        <li>
                            <strong>Giá tham chiếu (TC)</strong>: Là giá tham
                            chiếu đầu ngày hoặc giá đóng cửa phiên giao dịch gần
                            nhất.
                        </li>
                        <li>
                            <strong>Tỷ lệ định giá</strong>: Là tỷ lệ phần trăm
                            (%) định giá đối với mỗi loại đầu tư do HYRACAP quy
                            định, tỷ lệ này có thể được thay đổi bất kỳ lúc nào
                            mà không cần báo trước.
                        </li>
                    </ol>

                    <h4>2.1.2 Tài sản thực có (TSC)</h4>
                    <p>
                        Là giá trị tiền và đầu tư thực có trên TKKQ và được tính
                        theo công thức:
                    </p>
                    <p>
                        <strong>TSC = TSHH - Dư nợ lũy kế (Dn)</strong>
                    </p>

                    <h4>2.1.3 Tỷ lệ tài trợ (Rtt)</h4>
                    <p>
                        Là tỷ lệ (%) của dư nợ lũy kế (Dn) trên giá trị tài sản
                        thực có của khách hàng tại thời điểm giao dịch hoặc thời
                        điểm cần xác định tỷ lệ. Rtt do HYRACAP quy định, tỷ lệ
                        này có thể được HYRACAP thay đổi bất kỳ lúc nào mà không
                        cần báo trước.
                    </p>
                    <p>
                        Khách hàng phải đảm bảo một khoản … (tiếp tục nếu có
                        phần tiếp theo)
                    </p>
                </div>
                <h3>2.1. Các định nghĩa và công thức</h3>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        <strong>Tỷ lệ tài trợ (Rtt):</strong> Tiền/đầu tư gửi
                        trên tài khoản để ký kỹ tại HYRACAP theo đúng tỷ lệ
                        trước khi giao dịch, giải ngân khoản vay tại bất kỳ thời
                        điểm nào theo quy định của HYRACAP. Rtt được xác định
                        theo công thức:
                        <div>Rtt = [dự nợ lũy kế (Dn) / TSC] x 100%</div>
                    </li>
                    <li>
                        <strong>Tổng giá trị vay (TV):</strong> Là tổng số tiền
                        tối đa mà nhà đầu tư được vay để giao dịch và được tính
                        theo công thức:
                        <div>TV = Giá trị nhỏ nhất [HMTT, TSC x Rtt]</div>
                    </li>
                    <li>
                        <strong>Sức mua (BP):</strong> Là số tiền tối đa mà
                        khách hàng có thể mua đầu tư trong ngày.
                        <div>
                            BP = Số dư tiền + TSC x Rtt - dư nợ lũy kế (Dn)
                        </div>
                    </li>
                </ol>

                <h3>2.2. Các tỷ lệ duy trì trên tài khoản ký quỹ</h3>
                <h4>2.2.1. Nguyên tắc xác định tỷ lệ</h4>
                <p>
                    Việc xác định các yếu tố để tính giá trị tài sản và tỷ lệ
                    theo quy định của hợp đồng này được xác định trên cơ sở đã
                    trừ đi các khoản phí khách hàng phải trả cho HYRACAP.
                </p>

                <h4>
                    2.2.2. Các tỷ lệ duy trì và xử lý trên tài khoản giao dịch
                    ký quỹ
                </h4>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        <strong>Tỷ lệ an toàn tài khoản:</strong> Khi Rtt ≤ 67%:
                        Tài khoản khách hàng ở trạng thái đảm bảo an toàn theo
                        quy định.
                    </li>
                    <li>
                        <strong>Tỷ lệ gọi duy trì:</strong> Trường hợp giá đầu
                        tư giảm làm Rtt thay đổi: 67% &lt; Rtt &lt; 150%:
                        <ul>
                            <li>
                                Khách hàng có nghĩa vụ trả bớt nợ hoặc phải bổ
                                sung tài sản đảm bảo.
                            </li>
                            <li>
                                Nếu không trả bớt nợ vay, tài khoản giao dịch ký
                                quỹ của khách hàng có thể bị thanh lý TSĐB.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Tỷ lệ xử lý:</strong> Trường hợp giá đầu tư giảm
                        làm thay đổi Rtt: Rtt ≥ 150%:
                        <ul>
                            <li>
                                HYRACAP có quyền thanh lý một phần hoặc toàn bộ
                                tài sản đảm bảo (TSĐB).
                            </li>
                            <li>
                                Thực hiện các nghĩa vụ theo quy định của hợp
                                đồng, chấm dứt cho vay và thu nợ trước hạn một
                                phần hoặc các khoản vay chưa thanh toán của
                                khách hàng.
                            </li>
                        </ul>
                    </li>
                    <li>
                        HYRACAP không có trách nhiệm phải thông báo cho khách
                        hàng thời điểm Tỷ lệ tài trợ (Rtt) của khách hàng lớn
                        hơn hoặc bằng Tỷ lệ xử lý. Ngoài ra, HYRACAP có quyền
                        nhưng không có nghĩa vụ phải xử lý ngay khi Tỷ lệ tài
                        trợ (Rtt) bằng hoặc lớn hơn Tỷ lệ xử lý. Trong trường
                        hợp HYRACAP không xử lý ngay, khách hàng cũng không có
                        quyền khiếu nại HYRACAP về thời điểm xử lý tài sản đảm
                        bảo.
                    </li>
                </ol>
                <h3>3. Đảm bảo khoản vay</h3>
                <h4>3.1. Nghĩa vụ được bảo đảm và tài sản bảo đảm</h4>
                <ol style={{ listStylePosition: "inside" }}>
                    <li>
                        <strong>Nghĩa vụ được bảo đảm:</strong> Là nghĩa vụ trả
                        nợ được quy định tại hợp đồng này (bao gồm: trả nợ gốc,
                        lãi, phí, phạt, bồi thường thiệt hại và các chi phí khác
                        cũng như các nghĩa vụ hoàn trả, thanh toán trong trường
                        hợp hợp đồng bị hủy bỏ, chấm dứt, vô hiệu) của khách
                        hàng với HYRACAP.
                    </li>
                    <li>
                        <strong>Tài sản bảo đảm (TSĐB):</strong> Là toàn bộ số
                        dư tiền và đầu tư có trong tài khoản ký quỹ hiện có mà
                        khách hàng mở tại HYRACAP (TSĐB gồm: vốn tự có của khách
                        hàng và tài sản hình thành từ vốn vay của HYRACAP) theo
                        quy định của hợp đồng này.
                    </li>
                </ol>

                <h3>ĐIỀU KHOẢN TÀI SẢN ĐẢM BẢO</h3>

                <section>
                    <h4>3.1. Giá trị Tài Sản Đảm Bảo (TSĐB)</h4>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            HYRACAP có quyền tính toán, đánh giá và xác định lại
                            giá trị TSĐB của Khách hàng tại bất kỳ thời điểm nào
                            theo giá thị trường. Khách hàng đồng ý với việc đánh
                            giá này và cam kết không có bất kỳ khiếu nại hoặc
                            tranh chấp nào đối với HYRACAP.
                        </li>
                        <li>
                            Khách hàng đồng ý sử dụng toàn bộ số tiền, đầu tư và
                            các tài sản khác hợp pháp tại HYRACAP làm TSĐB, trừ
                            khi có thỏa thuận khác.
                        </li>
                    </ol>
                </section>

                <section>
                    <h4>3.2. Thời hạn bảo đảm</h4>
                    <p>
                        Kể từ ngày ký kết Hợp đồng cho đến khi Khách hàng thực
                        hiện toàn bộ nghĩa vụ trả nợ gốc, lãi, phí, phạt, nghĩa
                        vụ hoàn trả tiền vay và các nghĩa vụ khác theo quy định
                        của Hợp đồng và Phụ lục Hợp đồng.
                    </p>
                </section>

                <section>
                    <h4>3.3. Phong tỏa, sử dụng và quản lý TSĐB</h4>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            HYRACAP phong tỏa toàn bộ TSĐB của Khách hàng. Mọi
                            giao dịch mua bán đầu tư của Khách hàng tại HYRACAP
                            đều phải thông qua tài khoản giao dịch ký quỹ.
                        </li>
                        <li>
                            Khách hàng có thể bán một phần hoặc toàn bộ TSĐB để
                            mua đầu tư khác, với điều kiện số tiền về tài khoản
                            phải được sử dụng để trả các khoản nợ trước.
                        </li>
                        <li>
                            Khi Khách hàng hoàn thành nghĩa vụ trả nợ, HYRACAP
                            sẽ giải phóng TSĐB theo quy định của Hợp đồng.
                        </li>
                    </ol>
                </section>

                <section>
                    <h4>3.4. Xử lý TSĐB</h4>

                    <h4>3.4.1. Điều kiện xử lý TSĐB</h4>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            Khách hàng không thực hiện đúng hoặc đầy đủ các
                            nghĩa vụ trả nợ.
                        </li>
                        <li>
                            Giá trị TSĐB sụt giảm khiến tỷ lệ ký quỹ thực tế
                            thấp hơn quy định.
                        </li>
                        <li>
                            Khách hàng vi phạm cam kết hoặc có các sự kiện khiến
                            HYRACAP phải thu hồi nợ.
                        </li>
                        <li>Biến động thị trường gây giảm giá trị TSĐB.</li>
                    </ol>
                    <h4>3.4.2. Phương thức xử lý TSĐB</h4>
                    <ol style={{ listStylePosition: "inside" }}>
                        <li>
                            HYRACAP có quyền tự động thanh lý một phần hoặc toàn
                            bộ đầu tư trên tài khoản của Khách hàng để thu hồi
                            nợ mà không cần sự chấp thuận của Khách hàng.
                        </li>
                    </ol>

                    <h3>THÔNG BÁO VÀ THỜI GIAN XỬ LÝ</h3>

                    <div>
                        <h3>1. Quyền và nghĩa vụ của HYRACAP</h3>
                        <ol style={{ listStylePosition: "inside" }}>
                            <li>
                                - Trực tiếp nhận TSĐB (bao gồm cả gốc, lãi và
                                các quyền lợi phát sinh từ tài sản) để bù trừ,
                                thanh toán các nghĩa vụ của Khách hàng tại
                                HYRACAP;
                            </li>
                            <li>
                                - Tự mình hoặc ủy nhiệm cho bên khác thực hiện
                                việc chuyển nhượng, bán TSĐB theo cách thức, giá
                                cả do HYRACAP quyết định;
                            </li>
                            <li>
                                - Giá đầu tư bán xử lý TSĐB là giá thấp nhất
                                (ATO, giá sàn, ATC) hoặc giá khác do HYRACAP
                                quyết định và nằm trong biên độ quy định của Sở
                                GDCK Tp. Hồ Chí Minh và/hoặc Sở GDCK Hà Nội.
                                Khách hàng đồng ý và chấp nhận tuân thủ đúng giá
                                đầu tư để xử lý tài sản bảo đảm này và cam kết
                                không có bất kỳ khiếu nại, tranh chấp nào với
                                HYRACAP và ủy quyền cho HYRACAP thanh toán mọi
                                chi phí liên quan đến việc xử lý TSĐB theo đúng
                                quy định;
                            </li>
                            <li>
                                - Sau khi trừ các khoản phí, chi phí và các
                                khoản thuế có liên quan (nếu có), toàn bộ số
                                tiền còn lại trong số TSĐB được HYRACAP sử dụng,
                                xử lý để trả các khoản nợ mà Khách hàng phải trả
                                cho HYRACAP theo quy định của Hợp đồng này; nếu
                                còn dư HYRACAP trả lại số tiền dư này cho Khách
                                hàng; nếu còn thiếu thì Khách hàng có nghĩa vụ
                                tiếp tục trả cho HYRACAP. Các chi phí, thuế,
                                nghĩa vụ tài chính khác phát sinh trong quá
                                trình xử lý TSĐB do Khách hàng chịu.
                            </li>
                        </ol>
                    </div>

                    <div>
                        <h3>4. Thông báo và Thời gian xử lý</h3>
                        <p>
                            Phù hợp với quy định tại Điều 11 của Hợp đồng,
                            HYRACAP sẽ gửi thông báo cho Khách hàng trong ngày
                            T. Theo đó, trừ trường hợp thông báo có quy định
                            khác đi, Khách hàng chậm nhất trong ngày:
                        </p>
                        <ol style={{ listStylePosition: "inside" }}>
                            <li>
                                - T + 1 phải bổ sung TSĐB hoặc thanh lý toàn bộ
                                hoặc một phần tài sản để duy trì Tỷ lệ tài trợ
                                (Rtt), đối với trường hợp Tài khoản trong giới
                                hạn Tỷ lệ gọi duy trì.
                            </li>
                            <li>
                                - T phải bổ sung TSĐB hoặc thanh lý toàn bộ hoặc
                                một phần tài sản để duy trì Tỷ lệ tài trợ (Rtt),
                                đối với trường hợp Tài khoản chạm tỷ lệ xử lý.
                            </li>
                        </ol>
                        <p>
                            Nếu Khách hàng không thực hiện hoặc thực hiện không
                            đầy đủ việc bổ sung TSĐB hoặc thanh lý tài sản theo
                            thông báo, HYRACAP sẽ tự động xử lý TSĐB của tài
                            khoản Khách hàng.
                        </p>
                    </div>

                    <div className="pt-6">
                        <div className="flex justify-around">
                            <div className="flex flex-col justify-center text-center">
                                <h3>ĐẠI DIỆN KHÁCH HÀNG</h3>
                                <p>
                                    Đã đọc và đồng ý với các nội dung của Hợp
                                    đồng
                                </p>
                            </div>
                            <div>
                                <h3>ĐẠI DIỆN HYRACAP</h3>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center text-center items-center py-24">
                            <h3>BÊN NHẬN ỦY QUYỀN GIAO DỊCH (nếu có)</h3>
                            <p>
                                Đã đọc và đồng ý với các nội dung của Hợp đồng
                            </p>
                        </div>
                        <div className="flex flex-col justify-center text-center items-center">
                            <p>Cán bộ thụ lý hồ sơ</p>
                            <p>(Ký và ghi rõ họ tên)</p>
                        </div>
                    </div>
                </section>
            </div>
        </Stack>
    );
};
export default ContractForm;
