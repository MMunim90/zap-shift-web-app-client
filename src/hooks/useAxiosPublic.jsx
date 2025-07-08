import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5000", // replace with your deployed URL if needed
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
