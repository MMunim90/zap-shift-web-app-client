import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { FaEye, FaTrash, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router";

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
          <p><strong>Type:</strong> ${parcel.type}</p>
          <p><strong>Weight:</strong> ${parcel.weight || "N/A"} kg</p>
          <p><strong>Status:</strong> ${parcel.status}</p>
          <p><strong>Payment Status:</strong> ${parcel.payment_status}</p>
          <p><strong>Created At:</strong> ${dayjs(parcel.creation_date).format(
            "YYYY-MM-DD HH:mm"
          )}</p>
          <hr class="my-2"/>
          <p><strong>Total Cost:</strong> ৳${parcel.total_cost || "N/A"}</p>
        </div>
      `,
      confirmButtonText: "Close",
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
      <h2 className="text-2xl font-bold mb-4">My Parcels</h2>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-base">
                <th>#</th>
                <th>Title</th>
                <th>Type</th>
                <th>Created At</th>
                <th>Payment</th>
                <th>Total Cost</th>
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
                    {dayjs(parcel.creation_date).format("YYYY-MM-DD HH:mm")}
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
