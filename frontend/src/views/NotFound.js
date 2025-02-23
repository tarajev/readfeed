import React from 'react'
import iconAlert from '../resources/img/icon-alert.png'
import { Button, Link } from '../components/BasicComponents'

export default function NotFound() {
  return (
    <div className="flex fixed bg-gradient-to-br from-orange-50 to-gray-100 justify-center h-screen w-screen">
      <div className='w-full p-8 color-primary mt-12'>
        <span></span>
        <div className='flex justify-center'>
          <img
            className='w-12 h-12'
            src={iconAlert}
          />
          <span className='font-semibold my-auto text-black text-3xl ml-2'>Error 404 - Page Not Found.</span>
        </div>
        <Button className="mt-10 !bg-[#BF2734] font-semibold flex mx-auto text-xl rounded-md">
          <Link route='/' className='px-4 py-2 !no-underline !text-white'>
            Return to Main Page
          </Link>
        </Button>
      </div>
    </div>
  );
}