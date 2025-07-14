import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dayjs from "dayjs";
import { useState } from "react";
import Swal from "sweetalert2";
import useTrackingUpdater from "../../../hooks/useTrackingUpdater";
import useAuth from "../../../hooks/useAuth";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { updateTracking } = useTrackingUpdater();
  const { user } = useAuth();

  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
      return res.data.sort(
        (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
      );
    },
  });

  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["riders", selectedParcel?.senderArea],
    queryFn: async () => {
      if (!selectedParcel) return [];
      const res = await axiosSecure.get(
        `/riders?senderArea=${selectedParcel.senderArea}`
      );
      return res.data;
    },
    enabled: !!selectedParcel,
  });

  const handleAssignRider = (parcel) => {
    setSelectedParcel(parcel);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedParcel(null);
  };

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
                <th>Parcel Type</th>
                <th>Sender Center</th>
                <th>Receiver Center</th>
                <th>Cost</th>
                <th>Created At</th>
                <th>Payment</th>
                <th>Delivery Status</th>
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
                  <td>৳{parcel.total_cost}</td>
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
                      className="btn btn-sm bg-[#CAEB66] text-black"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded shadow-lg w-full max-w-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Riders in {selectedParcel?.senderArea}
            </h3>
            <button
              className="btn btn-sm btn-error absolute top-2 right-2"
              onClick={closeModal}
            >
              ✕
            </button>

            {ridersLoading ? (
              <Loading />
            ) : riders.length === 0 ? (
              <p>No riders found in this area.</p>
            ) : (
              <table className="table table-sm w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Bike Info</th>
                    <th>Area</th>
                    <th>Rider Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider, index) => (
                    <tr key={rider._id}>
                      <td>{index + 1}</td>
                      <td>{rider.name || "Unnamed"}</td>
                      <td>{rider.email}</td>
                      <td>{rider.phone}</td>
                      <td>{rider.bikeBrand || "Bike"}</td>
                      <td>{rider.district}</td>
                      <td>
                        <span
                          className={`w-24 badge ${
                            rider.work_status === "in-delivery"
                              ? "badge-warning"
                              : "badge-success"
                          }`}
                        >
                          {rider.work_status || "available"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-xs bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={rider.work_status === "in-delivery"}
                          onClick={async () => {
                            try {
                              await axiosSecure.patch("/assign-rider", {
                                parcelId: selectedParcel._id,
                                riderId: rider._id,
                                riderEmail: rider.email,
                                riderName: rider.name,
                              });

                              Swal.fire(
                                "Success",
                                "Rider assigned and parcel in transit",
                                "success"
                              );

                              // track rider assigned
                              await updateTracking({
                                tracking_id: selectedParcel.tracking_id,
                                status: "rider_assigned",
                                details: `Assigned to ${rider.name}`,
                                location: selectedParcel.senderArea,
                                updated_by: user.email,
                              });

                              closeModal();
                            } catch (error) {
                              console.error("Assignment failed", error);

                              const msg =
                                error?.response?.data?.message ||
                                "Failed to assign rider";
                              Swal.fire("Error", msg, "error");
                            }
                          }}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
