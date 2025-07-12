import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Loading from "../../shared/Loading/Loading";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: parcels = [], refetch, isLoading, isError } = useQuery({
    queryKey: ["pendingDeliveries", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/pending-deliveries");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleUpdateStatus = async (parcelId, newStatus) => {
    try {
      await axiosSecure.patch(`/parcels/${parcelId}/update-status`, {
        delivery_status: newStatus,
      });
      Swal.fire("Success", `Parcel marked as ${newStatus.replace("_", " ")}`, "success");
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (isLoading) return <div><Loading></Loading></div>;
  if (isError) return <p className="text-red-500">Failed to load parcels</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Pending Deliveries</h2>

      {parcels.length === 0 ? (
        <p>No pending deliveries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.senderName} ({parcel.senderArea})</td>
                  <td>{parcel.receiverName} ({parcel.receiverArea})</td>
                  <td>৳{parcel.total_cost}</td>
                  <td>
                    <span className="badge badge-warning">{parcel.delivery_status}</span>
                  </td>
                  <td>{dayjs(parcel.creation_date).format("DD-MM-YYYY")}</td>
                  <td className="space-x-2">
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        className="btn btn-xs bg-blue-500 text-white w-26 py-4 rounded-xl"
                        onClick={() => handleUpdateStatus(parcel._id, "in_transit")}
                      >
                        Mark as Picked
                      </button>
                    )}
                    {parcel.delivery_status === "in_transit" && (
                      <button
                        className="btn btn-xs bg-green-600 text-white w-28 py-4 rounded-xl"
                        onClick={() => handleUpdateStatus(parcel._id, "delivered")}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
