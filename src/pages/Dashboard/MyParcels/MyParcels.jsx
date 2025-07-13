import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { FaEye, FaTrash, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import Loading from "../../shared/Loading/Loading";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleView = (parcel) => {
    Swal.fire({
      title: "📦 Parcel Details",
      html: `
        <div class="text-left text-base leading-relaxed">
          <p><strong>Tracking ID:</strong> ${parcel.tracking_id}</p>
          <p><strong>Parcel ID:</strong> ${parcel._id}</p>
          <p><strong>Type:</strong> ${parcel.type}</p>
          <p><strong>Weight:</strong> ${parcel.weight || "N/A"} kg</p>
          <p><strong>Status:</strong> ${parcel.delivery_status.replace('_', ' ')}</p>
          <p><strong>Payment Status:</strong> ${parcel.payment_status}</p>
          <p><strong>Created At:</strong> ${dayjs(parcel.creation_date).format(
            "YYYY-MM-DD HH:mm"
          )}</p>
          <hr class="my-2"/>
          <p><strong>Total Cost:</strong> ৳${parcel.total_cost || "N/A"}</p>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#CAEB66",
    });
  };

  const handlePay = (parcel) => {
    navigate(`/dashboard/payment/${parcel._id}`);
  };

  const handleDelete = (parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete parcel "${parcel.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/parcels/${parcel._id}`).then(() => {
          Swal.fire("Deleted!", "Parcel has been deleted.", "success");
          refetch();
        });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Parcels</h2>

      {isLoading ? (
        <div className="text-center"><Loading></Loading></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-[#CAEB66] text-black">
              <tr className="text-base">
                <th>#</th>
                <th>Title</th>
                <th>Type</th>
                <th>Created At</th>
                <th>Payment</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td className="max-w-[180px] truncate">{parcel.title}</td>
                  <td className="capitalize">
                    {parcel.type === "document" ? "Document" : "Non-Document"}
                  </td>
                  <td>
                    {dayjs(parcel.creation_date).format("DD-MM-YYYY")}
                  </td>
                  <td>
                    <span
                      className={`badge px-3 py-1 text-sm ${
                        parcel.payment_status === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td>৳{parcel.total_cost || 0}</td>
                  <td><div className="w-20">{parcel.delivery_status.replace('_', ' ')}</div></td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(parcel)}
                        className="btn btn-sm btn-info text-white"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      {parcel.payment_status === "unpaid" && (
                        <button
                          onClick={() => handlePay(parcel)}
                          className="btn btn-sm btn-success text-white"
                          title="Pay"
                        >
                          <FaMoneyCheckAlt />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(parcel)}
                        className="btn btn-sm btn-error text-white"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {parcels.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">
                    No parcels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyParcels;
