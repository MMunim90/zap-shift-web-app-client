import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dayjs from "dayjs";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels?payment_status=paid&delivery_status=not_collected");
      return res.data.sort(
        (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
      );
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Failed to load parcels</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Assign Rider to Parcels</h2>
      {parcels.length === 0 ? (
        <p>No parcels available for assignment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Parcel Title</th>
                <th>Type</th>
                <th>Sender Center</th>
                <th>Receiver Center</th>
                <th>Cost</th>
                <th>Created At</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.type}</td>
                  <td>{parcel.senderArea}</td>
                  <td>{parcel.receiverArea}</td>
                  <td>{parcel.total_cost}</td>
                  <td>{dayjs(parcel.creation_date).format("DD-MM-YYYY")}</td>
                  <td>
                    <span className="badge badge-success">
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-warning">
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm p-4 bg-[#CAEB66] text-black"
                      onClick={() => handleAssignRider(parcel)}
                    >
                      Assign Rider
                    </button>
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

export default AssignRider;

// Placeholder for action — you'll define this later
const handleAssignRider = (parcel) => {
  console.log("Assigning rider to:", parcel);
};
