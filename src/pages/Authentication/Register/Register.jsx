import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
    const {register, handleSubmit} = useForm();

    const onSubmit = data => {
        console.log(data);
    }
  return (
    <div>
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Create an Account</h1>
        <p className="py-6">Register with Zap-Shift</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" {...register('email')} className="input" placeholder="Email" />

          <label className="label">Password</label>
          <input type="password" {...register('password')} className="input" placeholder="Password" />
        </fieldset>
        <button className="btn btn-neutral mt-4">Register</button>
      </form>
    </div>
  );
};

export default Register;
