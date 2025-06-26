import React from "react";
import { Link, NavLink } from "react-router";
import ZapShiftLogo from "../ZapShiftLogo/ZapShiftLogo";
import { MdArrowOutward } from "react-icons/md";

const Navbar = () => {
  const navItems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/about">About Us</NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar shadow-sm bg-white text-black font-bold my-6 rounded-2xl">
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
        <a className="btn btn-ghost text-xl">
          <ZapShiftLogo></ZapShiftLogo>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        <Link
          to="/login"
          className="btn btn-outline border-gray-300 hover:bg-[#CAEB66] text-black rounded-xl"
        >
          Sign In
        </Link>
        <div className="flex justify-center items-center ml-3">
          <button className="btn text-black bg-[#CAEB66] rounded-xl font-bold border-none">
            Be a rider
          </button>
          <button className="btn w-11 h-11 bg-black text-[#CAEB66] rounded-full font-bold">
            <MdArrowOutward size={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
