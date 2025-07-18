import React from "react";
import { NavLink, Outlet } from "react-router";
import ZapShiftLogo from "../pages/shared/ZapShiftLogo/ZapShiftLogo";
import {
  FaHome,
  FaUserCircle,
  FaBoxOpen,
  FaHistory,
  FaSearchLocation,
  FaMotorcycle,
  FaClock,
  FaUserCheck,
  FaTruckMoving,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { role, loading } = useUserRole();
  //console.log(role);
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <ZapShiftLogo></ZapShiftLogo>
          <li>
            <NavLink
              to="/dashboard/home"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded ${
                  isActive ? "bg-[#CAEB66] text-black" : ""
                }`
              }
            >
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded ${
                  isActive ? "bg-[#CAEB66] text-black" : ""
                }`
              }
            >
              <FaUserCircle /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded ${
                  isActive ? "bg-[#CAEB66] text-black" : ""
                }`
              }
            >
              <FaBoxOpen /> My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded ${
                  isActive ? "bg-[#CAEB66] text-black" : ""
                }`
              }
            >
              <FaHistory /> Payment History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/track"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded ${
                  isActive ? "bg-[#CAEB66] text-black" : ""
                }`
              }
            >
              <FaSearchLocation /> Track a Parcel
            </NavLink>
          </li>

          {/* admin link */}
          {!loading && role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/activeRiders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? "bg-[#CAEB66] text-black" : ""
                    }`
                  }
                >
                  <FaMotorcycle /> Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/assignRider"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? "bg-[#CAEB66] text-black" : ""
                    }`
                  }
                >
                  <FaUserCheck /> Assign Rider
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/pendingRiders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? "bg-[#CAEB66] text-black" : ""
                    }`
                  }
                >
                  <FaClock /> Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/manageAdmin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? "bg-[#CAEB66] text-black" : ""
                    }`
                  }
                >
                  <RiAdminFill /> Manage Admin
                </NavLink>
              </li>
            </>
          )}

          {/* riders link */}
          {!loading && role === "rider" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/pendingDeliveries"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? "bg-[#CAEB66] text-black" : ""
                    }`
                  }
                >
                  <FaTruckMoving /> Pending Deliveries
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/completedDeliveries"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? "bg-[#CAEB66] text-black" : ""
                    }`
                  }
                >
                  <FaCheckCircle /> Completed Deliveries
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/myEarnings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? "bg-[#CAEB66] text-black" : ""
                    }`
                  }
                >
                  <FaMoneyBillWave /> My Earnings
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
