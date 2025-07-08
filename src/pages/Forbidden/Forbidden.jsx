import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6 rounded-2xl border-5 border-[#CAEB66]">
      <FaLock className="text-6xl text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">403 - Forbidden</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>
      <Link
        to="/"
        className="btn bg-[#CAEB66] text-black hover:bg-[#b3d958] transition"
      >
        🔙 Go to Home
      </Link>
    </div>
  );
};

export default Forbidden;
