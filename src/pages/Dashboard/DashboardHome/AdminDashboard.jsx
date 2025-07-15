import { useQuery } from "@tanstack/react-query";
import { FaTruck, FaCheckCircle, FaUserTie, FaBoxOpen } from "react-icons/fa";
import Loading from "../../shared/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const statusColorMap = {
  in_transit: "#3B82F6", // Blue-500
  delivered: "#22C55E", // Green-500
  rider_assigned: "#EAB308", // Yellow-500
  not_collected: "#EF4444", // Red-500
};

// Status info mapping
const statusInfo = {
  in_transit: {
    label: "In Transit",
    icon: <FaTruck className="text-blue-500 text-2xl" />,
    color: "bg-blue-100 border-blue-300",
  },
  delivered: {
    label: "Delivered",
    icon: <FaCheckCircle className="text-green-500 text-2xl" />,
    color: "bg-green-100 border-green-300",
  },
  rider_assigned: {
    label: "Rider Assigned",
    icon: <FaUserTie className="text-yellow-500 text-2xl" />,
    color: "bg-yellow-100 border-yellow-300",
  },
  not_collected: {
    label: "Not Collected",
    icon: <FaBoxOpen className="text-red-500 text-2xl" />,
    color: "bg-red-100 border-red-300",
  },
};

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: statusCounts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deliveryStatusCount"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-red-500 text-center">
        Failed to load delivery status data.
      </p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-black">
        {statusCounts.map(({ status, count }) => {
          const info = statusInfo[status] || {
            label: status.replaceAll("_", " "),
            icon: <FaBoxOpen className="text-gray-500 text-2xl" />,
            color: "bg-gray-100 border-gray-300",
          };

          return (
            <div
              key={status}
              className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 ${info.color}`}
            >
              <div>{info.icon}</div>
              <div>
                <p className="text-sm text-gray-600">{info.label}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {statusCounts.length > 0 && (
        <div className="mt-8 w-full h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={4}
                label={({ payload }) =>
                  statusInfo[payload.status]?.label || payload.status
                }
              >
                {statusCounts.map(({ status }, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={statusColorMap[status] || "#A3A3A3"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} parcels`,
                  statusInfo[name]?.label || name,
                ]}
              />
              <Legend
                formatter={(value) => statusInfo[value]?.label || value}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
