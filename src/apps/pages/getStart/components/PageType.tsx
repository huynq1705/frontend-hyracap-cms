import ButtonCore from '@/components/button/core'
import BuildIcon from '@/components/icons/build_icon'
import DrinkIcon from '@/components/icons/drink'
import MicIcon from '@/components/icons/mic'
import SpaIcon from '@/components/icons/spa'
import StoreIcon from '@/components/icons/store'
import MySelectGroupV3 from '@/components/select-group/MySelectGroupItemV3'
import { setGlobalNoti } from '@/redux/slices/app.slice'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Stack } from '@mui/material'
import {  Typography } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

export const PageType = ({ setPage }: any) => {
    const dispatch = useDispatch();
    const [isChoose, setIsChoose] = useState(1)
    const handleChoose = (id: number) => {
        if (id === 1) {
            setIsChoose(1)
        } else {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: `Hệ thống đang phát triển!`,
                }),
            );
        }
    }
    return (
        <div className='flex flex-col h-[100vh] w-full justify-center gap-8 p-4 md:p-44'  >
            <div className='flex flex-col items-start'>
                <div className="text-[32px] text-[#1D2939] font-bold">Chọn ngành hàng</div>
                <Typography.Text>
                    Hãy chọn lĩnh vực mà công ty bạn đang hoạt động. Vui lòng lựa chọn cẩn thận do thông tin này không thể thay đổi.
                </Typography.Text>
            </div>

            <MySelectGroupV3
                handleChange={() => { }}
                name=""
                values={{}}
                // label="Đại lý thu hộ"
                list={[
                    { id: 1, name: "Spa mĩ phẩm", icon: <SpaIcon fill={isChoose == 1 ? "#ffff" : "#344054"} /> },
                    { id: 2, name: "Khách sạn", icon: <BuildIcon fill={isChoose == 2 ? "#ffff" : "#344054"} /> },
                    { id: 5, name: "Karaoke", icon: <MicIcon fill={isChoose == 5 ? "#ffff" : "#344054"} /> },
                    { id: 3, name: "Siêu thị bán lẻ", icon: <StoreIcon fill={isChoose == 3 ? "#ffff" : "#344054"} /> },
                    { id: 4, name: "Trà sữa, cà phê", icon: <DrinkIcon fill={isChoose == 4 ? "#ffff" : "#344054"} /> },
                ]}
                render={(item) => (
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
                        onClick={() => { handleChoose(item.id) }}
                        className='hover:border-[#50945D]'
                    >
                        {/* <Image
                            src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                            // alt={d?.name}
                            style={{ borderRadius: 8, height: 72, width: 72 }}
                        /> */}
                        {item.icon}
                        <Typography.Text
                            style={{ color: isChoose === item.id ? "#ffff" : "" }}
                        >{item.name}</Typography.Text>
                    </Stack>
                )}
            />
            <ButtonCore
                icon={<FontAwesomeIcon icon={faAngleRight} />}
                disabled={isChoose === 0} onClick={setPage}
                title='Tiếp tục'
                styles={{ flexDirection: 'row-reverse', width: "fit-content", padding: "16px", alignSelf: 'end' }} />

        </div>
    )
}
