import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) return;

      try {
        const res = await axiosSecure.get(`/users/role/${user.email}`);
        setRole(res.data.role || "user");
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setError("Failed to fetch role");
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchRole();
    }
  }, [user?.email, authLoading, axiosSecure]);

  return { role, loading, error };
};

export default useUserRole;
