import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://zap-shift-server-mu.vercel.app", // replace with your deployed URL if needed
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
