import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <p className="text-2xl font-bold text-blue-900">404</p>
        <h1 className="text-6xl font-bold py-2">Page Not Found</h1>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <div className="flexGrow pt-8 items-center">
          <span>

          <Link to="/" className="font-bold text-blue-900">Go back home <i class="fi fi-br-arrow-right"></i></Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Missing;
