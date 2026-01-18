import { BiError } from "react-icons/bi";

function Notfound() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <BiError className="text-6xl font-bold" />
      <h1 className='text-3xl font-bold'>404 - Page Not Found</h1>
      <p className='mt-4'>The page you are looking for does not exist.</p>
    </div>
  )
}

export default Notfound