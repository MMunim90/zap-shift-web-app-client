import { useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useTrackingUpdater = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateTracking = async ({ trackingId, parcelId, status, location }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axiosSecure.post("/tracking", {
        trackingId,
        parcelId,
        status,
        location,
      });

      if (res.data.result?.insertedId) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update tracking.");
    } finally {
      setLoading(false);
    }
  };

  return { updateTracking, loading, error, success };
};

export default useTrackingUpdater;
