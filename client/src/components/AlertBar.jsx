import React from 'react'

const AlertBar = () => {
  return (
    <>
      <div className='absolute top-0 h-[80px] md:h-[60px] lg:h-[50px] w-full bg-yellow-50 border-b border-yellow-300 shadow-sm flex items-center justify-center'>
        <p className='text-xs md:text-sm text-center leading-tight'>Please note that gmail feature wont work as this app is not published! </p>
      </div>
    </>
  )
}

export default AlertBar
