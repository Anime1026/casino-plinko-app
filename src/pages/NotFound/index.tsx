import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex h-[100%] flex-col items-center justify-center">
      <h1 className="text-[36px] font-bold text-text">404</h1>
      <h2 className="text-[24px] font-bold text-text">Page not found</h2>
      <Link
        to="/"
        className="mt-[16px] rounded-md bg-purpleDark px-[16px] py-[8px] font-bold text-text transition-colors hover:bg-purple"
      >
        Back to home page
      </Link>
    </div>
  )
}

export default NotFound;