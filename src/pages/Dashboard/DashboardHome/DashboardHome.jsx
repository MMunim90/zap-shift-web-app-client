import { FaBox, FaTruckMoving, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";
import useUserRole from "../../../hooks/useUserRole";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../../Forbidden/Forbidden";

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role, isLoading } = useUserRole();

  if(isLoading){
    return <Loading></Loading>
  }

  if(role === 'user'){
    return <UserDashboard></UserDashboard>
  }
  else if(role === 'rider'){
    return <RiderDashboard></RiderDashboard>
  }
  else if(role === 'admin'){
    return <AdminDashboard></AdminDashboard>
  }
  else{
    return <Forbidden></Forbidden>
  }

  // const { data: dashboardStats = {}, isLoading } = useQuery({
  //   queryKey: ["dashboardStats", user?.email],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/dashboard-stats?email=${user.email}`);
  //     return res.data;
  //   },
  //   enabled: !!user?.email,
  // });

  // const statCards = [
  //   {
  //     title: "Total Parcels",
  //     value: dashboardStats.totalParcels || 0,
  //     icon: <FaBox className="text-3xl text-blue-600" />,
  //   },
  //   {
  //     title: "Pending Deliveries",
  //     value: dashboardStats.pendingDeliveries || 0,
  //     icon: <FaTruckMoving className="text-3xl text-yellow-500" />,
  //   },
  //   {
  //     title: "Completed Deliveries",
  //     value: dashboardStats.completedDeliveries || 0,
  //     icon: <FaCheckCircle className="text-3xl text-green-600" />,
  //   },
  //   {
  //     title: "My Earnings",
  //     value: `৳${dashboardStats.totalEarnings || 0}`,
  //     icon: <FaMoneyBillWave className="text-3xl text-emerald-500" />,
  //   },
  // ];
}

export default DashboardHome;
