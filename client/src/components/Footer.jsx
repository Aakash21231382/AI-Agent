import React from 'react'
import { BsRobot } from 'react-icons/bs'

const Footer = () => {
  return (
    <div className='bg-[#a29c9c] flex justify-center px-4 pb-10 py-4 pt-10'>
        <div className='w-full max-w-6xl bg-[#a29c9c] rounded-[24px] shadow-sm border border-gray-200 py-8 px-3 text-center'>
            <div className='flex justify-center items-center gap-3 mb-3 '>
                <div className='bg-white text-black p-2 rounded-lg '><BsRobot size={16}/></div>
                <h2 className='font-semibold text-white'>InterviewIQ.AI</h2>

            </div>
            <p className='text-white text-sm max-w-xl mx-auto '> AI-powered interview preparation platform designed tom improve communication skills, technical depth and professional confidence.</p>
            
        </div>
      
    </div>
  )
}

export default Footer
