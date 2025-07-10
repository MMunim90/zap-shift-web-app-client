import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";

const ActiveRiders = () => {
  const [searchText, setSearchText] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch active riders
  const { data: riders = [], isLoading, isError } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riderApplications/approved");
      return res.data;
    }
  });

  // Deactivate rider
  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Deactivate Rider?",
      text: "You can re-approve later if needed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate"
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/riderApplications/status/${id}`, { status: "inactive" });
        Swal.fire("Deactivated!", "Rider is no longer active.", "success");
        queryClient.invalidateQueries(["activeRiders"]);
      } catch (err) {
        Swal.fire("Error", "Failed to deactivate rider.", err);
      }
    }
  };

  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="input input-bordered w-full max-w-xs mb-4"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {isLoading ? (
        <Loading></Loading>
      ) : isError ? (
        <p className="text-red-500">Failed to load active riders.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-[#CAEB66] text-black">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Area</th>
                <th>Bike</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.length ? (
                filteredRiders.map((rider, index) => (
                  <tr key={rider._id}>
                    <td>{index + 1}</td>
                    <td>{rider.name}</td>
                    <td>{rider.email}</td>
                    <td>{rider.phone}</td>
                    <td>{rider.region}</td>
                    <td>{rider.district}</td>
                    <td>{rider.bikeBrand}</td>
                    <td><button className="badge badge-success">{rider.status='Active'}</button></td>
                    <td>
                      <button
                        onClick={() => handleDeactivate(rider._id)}
                        className="badge badge-warning cursor-pointer"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">No active riders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;