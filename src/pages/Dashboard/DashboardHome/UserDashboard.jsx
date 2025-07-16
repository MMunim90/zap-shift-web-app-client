import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  CheckCircle,
  Clock,
  Wallet,
  Banknote,
} from 'lucide-react';
import useUserRole from '../../../hooks/useUserRole';
import Loading from '../../shared/Loading/Loading';

const UserDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role: userRole, loading: roleLoading } = useUserRole();

  const { data: stats = {}, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', userRole, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/stats?role=${userRole}&email=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email && !!userRole && !roleLoading,
  });

  // Show loading until both role and stats are ready
  if (isLoading || roleLoading) return <div className="text-center mt-20"><Loading /></div>;

  // Show fallback if userRole is not sender/rider
  if (!['user', 'rider'].includes(userRole)) {
    return (
      <div className="text-center text-red-500 mt-10">
        You don't have a valid role assigned. Please contact admin.
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load stats. Please try again.
      </div>
    );
  }

  const {
    totalParcels = 0,
    deliveredParcels = 0,
    pendingParcels = 0,
  } = stats;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-black">
        <StatCard title="Total Parcels" value={totalParcels} color="bg-blue-100" Icon={Package} />
        <StatCard title="Delivered Parcels" value={deliveredParcels} color="bg-green-100" Icon={CheckCircle} />
        <StatCard title="Pending Parcels" value={pendingParcels} color="bg-yellow-100" Icon={Clock} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, Icon }) => (
  <div className={`${color} p-6 rounded-xl shadow text-center flex flex-col items-center`}>
    <Icon className="w-10 h-10 text-gray-700 mb-2" />
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default UserDashboard;
