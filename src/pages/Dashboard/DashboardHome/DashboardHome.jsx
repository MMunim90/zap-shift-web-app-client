import { FaBox, FaTruckMoving, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";
import useUserRole from "../../../hooks/useUserRole";

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role } = useUserRole();

  const { data: dashboardStats = {}, isLoading } = useQuery({
    queryKey: ["dashboardStats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard-stats?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const statCards = [
    {
      title: "Total Parcels",
      value: dashboardStats.totalParcels || 0,
      icon: <FaBox className="text-3xl text-blue-600" />,
    },
    {
      title: "Pending Deliveries",
      value: dashboardStats.pendingDeliveries || 0,
      icon: <FaTruckMoving className="text-3xl text-yellow-500" />,
    },
    {
      title: "Completed Deliveries",
      value: dashboardStats.completedDeliveries || 0,
      icon: <FaCheckCircle className="text-3xl text-green-600" />,
    },
    {
      title: "My Earnings",
      value: `৳${dashboardStats.totalEarnings || 0}`,
      icon: <FaMoneyBillWave className="text-3xl text-emerald-500" />,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Welcome Back {role === 'user' ? user?.displayName : role} 👋</h2>

      {isLoading ? (
        <div><Loading></Loading></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 flex items-center gap-4 border border-gray-100"
            >
              <div className="p-2 rounded-full bg-gray-100">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-xl font-bold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
