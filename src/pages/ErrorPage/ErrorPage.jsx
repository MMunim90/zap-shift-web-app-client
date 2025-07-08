import { Link, useRouteError } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error); // Optional: Log the error

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center rounded-2xl border-5 border-[#CAEB66]">
      <FaExclamationTriangle className="text-6xl text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
      <p className="text-gray-600 mb-4">
        {error?.statusText || error?.message || "An unexpected error has occurred."}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {error?.status && `Error Code: ${error.status}`}
      </p>
      <Link
        to="/"
        className="btn bg-[#CAEB66] text-black hover:bg-[#b3d958] transition"
      >
        🔙 Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
