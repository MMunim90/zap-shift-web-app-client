import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          confirmButtonColor: "#CAEB66",
          draggable: true,
        });
        navigate(from);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Welcome Back! 👋</h1>
        <p className="py-6">Login with Zap-Shift</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input"
            placeholder="Email"
          />

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

          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
        </fieldset>
        <button className="btn bg-[#CAEB66] text-black w-[320px] font-bold mt-4 mb-1">
          Login
        </button>
        <p>
          <small>
            Don’t have any account?{" "}
            <Link className="text-[#CAEB66] font-bold btn-link" to="/register">
              Register
            </Link>
          </small>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Login;
