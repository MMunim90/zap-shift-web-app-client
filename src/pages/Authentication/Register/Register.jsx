import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import Swal from "sweetalert2";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = useAxios();

  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);

        //update userinfo in the database
        const userInfo = {
          email: data.email,
          role: "user", // default role
          created_at: new Date().toISOString(),
          last_logged_in: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);

        // update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile name pic updated");
          })
          .catch((error) => {
            console.log(error);
          });

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

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };
  return (
    <div>
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Create an Account</h1>
        <p className="py-6">Register with Zap-Shift</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          {/* image  */}
          <label className="label">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-[320px]"
            required
          />

          {/* name  */}
          <label className="label">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input"
            placeholder="Name"
          />
          {errors.name?.type === "required" && (
            <p className="text-red-500">Name is required</p>
          )}

          {/* email  */}
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

          {/* password */}
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
