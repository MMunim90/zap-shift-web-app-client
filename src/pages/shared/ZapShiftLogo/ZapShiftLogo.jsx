import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const ZapShiftLogo = () => {
  return (
    <Link to='/'>
      <div className="flex items-end">
        <img className="mb-1" src={logo} alt="" />
        <p className="text-3xl font-extrabold -ml-3">Zap-Shift</p>
      </div>
    </Link>
  );
};

export default ZapShiftLogo;
