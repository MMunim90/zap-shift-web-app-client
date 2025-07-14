import { useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useTrackingUpdater = () => {
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateTracking = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const body = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined)
      );

      const res = await axiosSecure.post("/tracking", body);

      if (res.data?.insertedId || res.data?.result?.insertedId) {
        setSuccess(true);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update tracking."
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateTracking, loading, error, success };
};

export default useTrackingUpdater;
