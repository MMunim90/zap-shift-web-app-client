import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import dayjs from "dayjs";
import Loading from "../../shared/Loading/Loading";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/completed-deliveries");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const calculateEarnings = (parcel) => {
    const cost = Number(parcel.total_cost);
    if (parcel.senderDistrict === parcel.receiverDistrict) {
      return (cost * 0.9).toFixed(2); // 90%
    } else {
      return (cost * 0.6).toFixed(2); // 30%
    }
  };

  if (isLoading)
    return (
      <div>
        <Loading></Loading>
      </div>
    );
  if (isError) return <p className="text-red-500">Failed to load deliveries</p>;

  const totalEarnings = parcels.reduce(
    (sum, parcel) => sum + parseFloat(calculateEarnings(parcel)),
    0
  );

  const handleCashout = async (parcelId) => {
  const confirm = await Swal.fire({
    title: "Cash Out?",
    text: "Do you want to cash out this delivery fee?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });

  if (!confirm.isConfirmed) return;

  try {
    await axiosSecure.patch(`/rider/cashout/${parcelId}`);
    Swal.fire("Success", "Delivery fee cashed out!", "success");
    refetch();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Cashout failed", "error");
  }
};


  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Completed Deliveries</h2>

      {parcels.length === 0 ? (
        <p>No deliveries completed yet.</p>
      ) : (
        <>
          <div className="mb-4 text-lg font-medium">
            Total Earnings: ৳{totalEarnings.toFixed(2)}
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Title</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Cost</th>
                  <th>Picked At</th>
                  <th>Delivered At</th>
                  <th>Status</th>
                  <th>Earnings</th>
                  <th>Cashout</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td>{parcel.tracking_id}</td>
                    <td>{parcel.title}</td>
                    <td>
                      {parcel.senderName} ({parcel.senderRegion})
                    </td>
                    <td>
                      {parcel.receiverName} ({parcel.receiverRegion})
                    </td>
                    <td>৳{parcel.total_cost}</td>
                    <td>
                      {parcel.pickedAt
                        ? dayjs(parcel.pickedAt).format("DD-MM-YYYY A")
                        : "N/A"}
                    </td>
                    <td>
                      {parcel.deliveredAt
                        ? dayjs(parcel.deliveredAt).format("DD-MM-YYYY A")
                        : "N/A"}
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {parcel.delivery_status}
                      </span>
                    </td>
                    <td>৳{calculateEarnings(parcel)}</td>
                    <td>
                      {parcel.isCashedOut ? (
                        <span className="badge badge-success w-26">Cashed Out</span>
                      ) : (
                        <button
                          className="btn btn-sm bg-yellow-500 text-black w-20 rounded-xl"
                          onClick={() => handleCashout(parcel._id)}
                        >
                          Cash Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CompletedDeliveries;
