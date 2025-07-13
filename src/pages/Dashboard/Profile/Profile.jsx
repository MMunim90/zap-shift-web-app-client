import React from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Fade } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";

const Profile = () => {
  const { user, setUser, updateUserProfile } = useAuth();
  console.log(user)
  const { role } = useUserRole();

  const handleUpdateUser = (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const photoURL = form.photoURL.value;

    updateUserProfile({
      displayName: name,
      photoURL: photoURL,
    })
      .then(() => {
        setUser({ ...user, displayName: name, photoURL: photoURL });
        Swal.fire({
          title: "Great!",
          text: "You update your profile successfully!",
          icon: "success",
        });
      })
      .catch((error) => {
        //console.log(error);
        toast.error(error);
        setUser(user);
      });
  };

  const slightFadeDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px); 
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

  return (
    <div className="w-full mx-auto">
      <div className="w-11/12 mx-auto mt-20 grid grid-cols-1 items-center">
        <Fade direction="down" keyframes={slightFadeDown}>
          <div className="flex flex-col items-center gap-8 md:mb-10">
           <p className="font-bold text-5xl">{role} profile</p>
            <img className="w-92 h-92 rounded-full object-cover border-5 border-[#CAEB66]" src={user.photoURL} alt="" />
            <h1 className="font-bold text-3xl">
              Name : {user && user.displayName}
            </h1>
            <p className="text-xl">Email : {user.email}</p>
          </div>
        </Fade>
        <Fade direction="down" keyframes={slightFadeDown}>
          <h1 className="font-bold text-3xl md:text-5xl text-center mb-10">
            Update Your Profile
          </h1>
        </Fade>
        <Fade direction="down" keyframes={slightFadeDown}>
          <div className="mt-8 md:mt-0">
            <form
              onSubmit={handleUpdateUser}
              className="bg-[#CAEB66] p-10 rounded-2xl space-y-6"
            >
              <div className="space-y-1 text-sm">
                <label htmlFor="username" className="block dark:text-black">
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  id="username"
                  placeholder="Username"
                  required
                  className="w-full px-4 py-3 rounded-md bg-gray-50 text-black"
                />
              </div>

              <div className="space-y-1 text-sm">
                <label className="block text-black">Photo URL</label>
                <input
                  type="text"
                  name="photoURL"
                  id="photoURL"
                  placeholder="Photo URL"
                  required
                  className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-black"
                />
              </div>

              <button
                type="submit"
                className="block w-full p-3 mt-10 text-white text-center rounded-sm text-xl bg-[#03373D] cursor-pointer"
              >
                Update Profile
              </button>
            </form>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Profile;
