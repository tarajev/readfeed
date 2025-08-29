import iconAlert from '../resources/img/icon-alert.png'
import { Button, Link } from '../components/BasicComponents'

export default function Unauthorized() {
  return (
    <div className="font-playfair flex fixed bg-secondary justify-center h-screen w-screen">
      <div className='w-full p-8 color-primary mt-12'>
        <h1 className='mb-4 sm:text-4xl font-semibold !text-[#07090D] justify-self-center self-center mx-auto'>
          readfeed.
        </h1>
        <div className='flex justify-center'>
          <img
            className='w-12 h-12 filter-primary'
            src={iconAlert}
          />
          <span className='font-semibold my-auto text-3xl ml-2'>Error 401 - Unauthorized.</span>
        </div>
        <Button className="mt-10 font-semibold flex mx-auto text-xl rounded-md">
          <Link route='/' className='px-4 py-2 !no-underline !text-white'>
            Back to Main Page
          </Link>
        </Button>
      </div>
    </div>
  );
}