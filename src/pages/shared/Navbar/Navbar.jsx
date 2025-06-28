import React, { use } from "react";
import { Link, NavLink } from "react-router";
import ZapShiftLogo from "../ZapShiftLogo/ZapShiftLogo";
import { MdArrowOutward } from "react-icons/md";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BiLogOut } from "react-icons/bi";

const Navbar = () => {
  const { user, logOut } = use(AuthContext);

  const handleLogOut = () => {
    // console.log("user trying to logout")
    logOut()
      .then(() => {
        Swal.fire({
          title: "Drag me!",
          icon: "success",
          confirmButtonColor: "#CAEB66",
          draggable: true,
        });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const navItems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/about">About Us</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>
      {
        user ? (<li>
        <NavLink to="/sendParcel">Send Parcel</NavLink>
      </li>) : ''
      }
    </>
  );
  return (
    <div className="navbar shadow-sm bg-white text-black font-bold my-6 rounded-2xl sticky top-0 z-50 border-2 border-[#CAEB66]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <a className="btn bg-white border-none shadow-none text-black text-xl">
          <ZapShiftLogo></ZapShiftLogo>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        {!user ? (
          <div className="flex">
            <Link
              to="/login"
              className="btn btn-outline border-gray-300 hover:bg-[#CAEB66] text-black rounded-xl"
            >
              Sign In
            </Link>
            <div className="hidden md:block flex justify-center items-center ml-3">
              <button className="btn text-black bg-[#CAEB66] rounded-xl font-bold border-none">
                Be a rider
              </button>
            </div>
              <button className="hidden md:block w-10 h-10 bg-black text-[#CAEB66] rounded-full font-bold">
                <MdArrowOutward className="mx-auto" size={25} />
              </button>
          </div>
        ) : (
          ""
        )}
        {user ? (
          <button
            onClick={handleLogOut}
            className="btn border-none bg-[#CAEB66] text-black rounded-xl"
          >
            <BiLogOut />
            Log out
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Navbar;
