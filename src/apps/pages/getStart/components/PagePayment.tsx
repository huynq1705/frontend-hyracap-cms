import apiPaymentMethodService from '@/api/apiPayment.service'
import ButtonCore from '@/components/button/core'
import BankBidv from '@/components/icons/bank_bidv'
import BankEX from '@/components/icons/bank_ex'
import BankHB from '@/components/icons/bank_hp'
import BankMB from '@/components/icons/bank_mp'
import BankSC from '@/components/icons/bank_sc'
import BankVP from '@/components/icons/bank_vp'
import CartIcon from '@/components/icons/cart'
import CartVS from '@/components/icons/cart_vs'
import MoneyIcon from '@/components/icons/money'
import PosIcon from '@/components/icons/pos'
import QRIcon from '@/components/icons/qr'
import MySelectGroupV3 from '@/components/select-group/MySelectGroupItemV3'
import { faAngleRight, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Stack } from '@mui/material'
import { Image, Typography } from 'antd'
import React, { ReactElement, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
const icons = [
<MoneyIcon fill="#ffff" />,
 <QRIcon fill="#ffff" />, 
<CartVS fill="#ffff" />, 
 <PosIcon fill="#ffff" />
]
export const PagePayment = () => {
    const navigate = useNavigate();
    const { setPaymentMethod, getPaymentMethod } = apiPaymentMethodService();
    const [listPayment, setListPayment] =  useState<{
        id : number,
        name:string,
        icon : ReactElement
    }[]>(
        [
            { id: 32, name: "Tiền mặt", icon: <MoneyIcon fill={"#344054"} /> },
            { id: 30, name: "QR Code", icon: <QRIcon fill={"#344054"} /> },
            { id: 31, name: "Thẻ ngân hàng", icon: <CartVS fill={"#344054"} /> },
            { id: 29, name: "Moto", icon: <PosIcon fill={"#344054"} /> },
        ]
    )
    const [isChoose, setIsChoose] = useState(0)
    const getPayment = () => {
        getPaymentMethod().then((e) => {
           setListPayment(listPayment.map((item, index)=>({
            id : e.data[index].id,
            name : e.data[index].name,
            icon : item.icon,
           })))
        }).catch(() => {

        })
    }
    const handleSubmitUpdate = async () => {
        try {
            const response = await setPaymentMethod({ id: isChoose,default_payment :1})
            // let message = "Cập nhật phương thức thanh toán thất bại";
            // let type = "error";
            // if (response === true) {
                
            // } 
           
        } catch (error) {
       
        } finally {
            navigate("/admin") 
        }
    };
    useEffect(()=>{
        getPayment()
    },[])
    return (
        <div className='flex flex-col h-[100vh] w-full justify-center gap-8 p-4 md:p-44'  >
            <div className='flex flex-col items-start'>
                <div className="text-[32px] text-[#1D2939] font-bold">Chọn phương thức thanh toán</div>
                <Typography.Text>
                    Hãy chọn các phương thức thanh toán mà bạn muốn sử dụng
                </Typography.Text>
            </div>

            <MySelectGroupV3
                handleChange={() => { }}
                name=""
                values={{}}
                list={listPayment}
                render={(item, index) => (
                    <Stack
                        sx={{
                            alignItems: "center",
                            gap: "8px",
                            border: `1.6px solid ${isChoose === item.id ? "#50945D" : "#D0D5DD"}`,
                            p: "24px 12px",
                            borderRadius: "12px",
                            flex: 1,
                            backgroundColor: isChoose === item.id ? "#50945D" : "none"
                        }}
                        onClick={() => { setIsChoose(item.id) }}
                        className='hover:border-[#50945D]'
                    >
                        {/* <Image
                            src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                            // alt={d?.name}
                            style={{ borderRadius: 8, height: 72, width: 72 }}
                        /> */}
                        {isChoose === item.id ? icons[index] : item.icon}
                        <Typography.Text
                            style={{ color: isChoose === item.id ? "#ffff" : "" }}
                        >{item.name}</Typography.Text>
                    </Stack>
                )}
            />
            <Stack spacing={"12px"}>
                <Typography.Text>
                    Thông tin giao dịch được xử lý bởi
                </Typography.Text>
                <MySelectGroupV3
                    handleChange={() => { }}
                    name=""
                    values={{}}
                    list={[
                        { id: 1, icon: <BankBidv /> },
                        // { id: 2, icon: <BankEX /> },
                        { id: 3, icon: <BankMB /> },
                        { id: 4, icon: <BankVP /> },
                        { id: 5, icon: <BankHB /> },
                        // { id: 6, icon: <BankSC /> },
                    ]}
                    render={(item) => (
                        <Stack
                        // sx={{
                        //     alignItems: "center",
                        //     gap: "8px",
                        //     border: `1.6px solid ${isChoose === item.id ? "#50945D" : "#D0D5DD"}`,
                        //     p: "24px 12px",
                        //     borderRadius: "12px",
                        //     flex: 1,
                        // }}
                        // onClick={() => { setIsChoose(item.id) }}
                        >
                            {/* <Image
                                src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                                // alt={d?.name}
                                style={{ height: 40, width: 120 }}
                            /> */}
                            {item.icon}
                        </Stack>
                    )}
                />
            </Stack>
            <ButtonCore
                icon={<FontAwesomeIcon icon={faAngleRight} />}
                disabled={isChoose === 0}
                onClick={handleSubmitUpdate}
                title='Tiếp tục'
                styles={{ flexDirection: 'row-reverse', width: "fit-content", padding: "16px", alignSelf: 'end' }} />

        </div>
    )
}
