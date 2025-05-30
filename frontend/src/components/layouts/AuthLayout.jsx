import React from 'react'
import Auth from '../../assets/auth.mp4'

const AuthLayout = ({children}) => {
  return (
    <div  className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h2 className='text-2xl font-semibold text-black'>FeedBack App</h2>
            {children}
        </div>
        <div className='hidden md:flex w-[40vw] h-screen items-center justify-center '>
            <video autoPlay loop muted playsInline src={Auth} className='h-full object-center object-cover'></video>
        </div>
    </div>
  )
}

export default AuthLayout
