import React from 'react'
import ButtonCore from '@/components/button/core'
import { Stack } from '@mui/material'
import { Typography } from 'antd'
import useCustomTranslation from '@/hooks/useCustomTranslation';

interface HeaderPageProps {
    statusPage : string;
    setStatusPage : (a : string) => void;
    handleSubmitUpdate :VoidFunction
}

export const HeaderPage = (props : HeaderPageProps) => {
    const {statusPage, setStatusPage, handleSubmitUpdate}  = props
    const { T, t } = useCustomTranslation();
  return (
      <Stack
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={'row'}>
          <Typography.Text style={{ fontSize: 18, fontWeight: "500" }}>
              Thông tin chung
          </Typography.Text>


          {
              statusPage === "detail" ?
                  <ButtonCore
                      title='Chỉnh sửa thông tin'
                      type="bgWhite"
                      onClick={() => setStatusPage("")}
                  />
                  :
                  <Stack alignItems={"center"} flexDirection={'row'} justifyContent={"center"} sx={{ gap: "12px" }}>
                      <ButtonCore
                          title={T("cancel")}
                          type="bgWhite"
                          onClick={() => setStatusPage("detail")}
                      />
                      <ButtonCore title={"Hoàn tất"} onClick={handleSubmitUpdate} />
                  </Stack>
          }

      </Stack>
  )
}
