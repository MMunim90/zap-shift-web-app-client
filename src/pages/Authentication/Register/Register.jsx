import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();

  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser } = useAuth();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        Swal.fire({
          title: "Registration Successful!",
          icon: "success",
          confirmButtonColor: "#CAEB66",
          draggable: true,
        });
        navigate(from);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Create an Account</h1>
        <p className="py-6">Register with Zap-Shift</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input"
            placeholder="Email"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-500">Email is required</p>
          )}

          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">
              Password must be 6 character or longer
            </p>
          )}
        </fieldset>
        <button
          type="submit"
          className="btn bg-[#CAEB66] text-black w-[320px] font-bold mt-4 mb-1"
        >
          Register
        </button>
        <p>
          <small>
            Already have an account?{" "}
            <Link className="text-[#CAEB66] font-bold btn-link" to="/login">
              Login
            </Link>
          </small>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;
