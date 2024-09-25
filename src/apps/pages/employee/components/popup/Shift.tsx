import ButtonCore from '@/components/button/core'
import MyTextField from '@/components/input-custom-v2/text-field'
import MyTextSelectTime from '@/components/input-custom-v2/time/MySelectTime'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Stack } from '@mui/material'
import { Typography } from 'antd'
import React from 'react'


interface ShiftProps {
    values: {
        start_time: string,
        end_time: string,
        content: string
    }[],
    name: string,
    onChange: (name: string, value: any) => void;
    title?: string
}

export const Shift = (props: ShiftProps) => {
    const { values = [], name, onChange, title } = props
    const handleOnchangeTime = (nameValue: "start_time" | "end_time" | "content", value: string, index: number) => {
        let newForm = [...values]

        newForm[index][nameValue] = value
        onChange(name, newForm)
        // setFormData((prev) => ({ ...prev, list_shift: newForm }));
    };
    const handleOnchangeTimePush = () => {
        let newForm = [
            ...values,
            {
                start_time: "07:00:00",
                end_time: "12:00:00",
                content: "Nội dung"
            }
        ]
        onChange(name, newForm)
    };
    const handleOnchangeTimeClose = (indexValue: number) => {
        let newForm = [...values]

        onChange(name, newForm.filter((_, index) => index !== indexValue))
    };
    return (
        <>
            <label className="label" style={{ width: '100%' }}>
                {title}
            </label>
            {
                values?.map((item: any, index: number) => (
                    <div className="wrapper-from"
                        style={{
                            border: "1px solid #D0D5DD",
                            backgroundColor: '#F9FAFB',
                            borderRadius: "8px",
                            padding: 16,
                            position: 'relative'
                        }}>

                        <MyTextSelectTime
                            label="Thời gian bắt đầu"
                            errors={[]}
                            required={[]}
                            configUI={{
                                width: "calc(50% - 12px)",
                            }}
                            name="start_time"
                            placeholder="Nhập"
                            handleChange={(name, value) => handleOnchangeTime("start_time", value, index)}
                            values={item}
                            validate={{}}
                        />
                        <MyTextSelectTime
                            label="Thời gian kết thúc"
                            errors={[]}
                            required={[]}
                            configUI={{
                                width: "calc(50% - 12px)",
                            }}
                            name="end_time"
                            placeholder="Nhập"
                            handleChange={(name, value) => handleOnchangeTime("end_time", value, index)}
                            values={item}
                            validate={{}}
                        />
                        <MyTextField
                            label="Nội dung"
                            errors={[]}
                            required={[]}
                            configUI={{
                                width: "calc(100%)",
                            }}
                            name="content"
                            placeholder="Nhập"
                            handleChange={(e) => handleOnchangeTime("content", e.target.value, index)}
                            values={item}
                            validate={{}}
                        />
                        <button
                            onClick={() => handleOnchangeTimeClose(index)}
                            style={{ border: "none", backgroundColor: '#F9FAFB', position: 'absolute', top: 8, right: 6, cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ width: 24, height: 24 }} />
                        </button>
                    </div>
                ))
            }

            <Box
                width={"calc(100% - 12px)"}
            >
                <ButtonCore
                    title="Thêm ca"
                    type="default"
                    onClick={handleOnchangeTimePush}
                />
            </Box>
        </>
    )
}
