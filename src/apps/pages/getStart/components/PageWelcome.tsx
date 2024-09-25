import ButtonCore from '@/components/button/core'
import { faAngleRight, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const PageWelcome = ({setPage} : any ) => {
  return (
    <div className='flex flex-col h-[100vh] w-full items-center justify-center gap-14'  >
      <div className='flex flex-col items-center'>
        <div
          className="logo-mitu"
        >
          <img
            className="w-[92px] h-[92px] "
            src="/assets/images/logo/logo.svg"
            alt="logo_mitu"
          />
        </div>
        <div className="text-[56px] text-center">Chào mừng bạn đến với Mitu</div>
      </div>
      <ButtonCore icon={<FontAwesomeIcon icon={faAngleRight} />} title='Tiếp tục' onClick={setPage} styles={{flexDirection:'row-reverse'}} />
   
    </div>
  )
}
