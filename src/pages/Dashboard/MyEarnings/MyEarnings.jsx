import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import dayjs from "dayjs";
import Loading from "../../shared/Loading/Loading";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/completed-deliveries");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const feeEarned = (p) => {
    const cost = Number(p.total_cost || 0);
    const sameDistrict = p.senderDistrict === p.receiverDistrict;
    return sameDistrict ? cost * 0.9 : cost * 0.3;
  };

  const sumByFilter = (filterFn) =>
    parcels.filter(filterFn).reduce((tot, p) => tot + feeEarned(p), 0);

  const startOfToday = dayjs().startOf("day");
  const startOfWeek = dayjs().startOf("week");
  const startOfMonth = dayjs().startOf("month");
  const startOfYear = dayjs().startOf("year");

  const isCompleted = (p) =>
    ["delivered", "service_center_delivered"].includes(p.delivery_status);

  const isCashedOut = (p) => p.isCashedOut === true;


  const totalEarnings = sumByFilter(isCompleted);
  const totalCashedOut = sumByFilter((p) => isCompleted(p) && isCashedOut(p));
  const totalPending = totalEarnings - totalCashedOut;

  const today = sumByFilter(
    (p) => isCompleted(p) && dayjs(p.deliveredAt).isAfter(startOfToday)
  );
  const thisWeek = sumByFilter(
    (p) => isCompleted(p) && dayjs(p.deliveredAt).isAfter(startOfWeek)
  );
  const thisMonth = sumByFilter(
    (p) => isCompleted(p) && dayjs(p.deliveredAt).isAfter(startOfMonth)
  );
  const thisYear = sumByFilter(
    (p) => isCompleted(p) && dayjs(p.deliveredAt).isAfter(startOfYear)
  );

  const fmt = (v) => `৳${v.toFixed(2)}`;


  if (isLoading) return <div><Loading></Loading></div>;
  if (isError) return <p className="text-red-500">Failed to load data</p>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">My Earnings</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        <Card title="Total Earnings" value={fmt(totalEarnings)} color="green" />
        <Card title="Total Cashed Out" value={fmt(totalCashedOut)} color="blue" />
        <Card title="Pending Cashout" value={fmt(totalPending)} color="yellow" />
      </div>

      {/* Breakdown */}
      <div>
        <h3 className="text-lg font-medium mb-2">Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-black">
          <Mini title="Today" value={fmt(today)} />
          <Mini title="This Week" value={fmt(thisWeek)} />
          <Mini title="This Month" value={fmt(thisMonth)} />
          <Mini title="This Year" value={fmt(thisYear)} />
          <Mini title="Overall" value={fmt(totalEarnings)} />
        </div>
      </div>
    </div>
  );
};

/* Re‑usable small card components */
const Card = ({ title, value, color }) => (
  <div
    className={`p-4 rounded-lg shadow bg-${color}-100 border border-${color}-200`}
  >
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const Mini = ({ title, value }) => (
  <div className="p-3 bg-gray-100 rounded text-center">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default MyEarnings;