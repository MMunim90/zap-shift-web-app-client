import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const [pendingRiders, setPendingRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get("/riderApplications/pending")
      .then(res => setPendingRiders(res.data))
      .catch(err => console.error(err));
  }, [axiosSecure]);

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Rider?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/riderApplications/status/${id}`, { status: "approved" });
        setPendingRiders(prev => prev.filter(r => r._id !== id));
        Swal.fire("Approved!", "Rider application has been approved.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to approve rider.", error);
      }
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Application?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/riderApplications/${id}`);
        setPendingRiders(prev => prev.filter(r => r._id !== id));
        Swal.fire("Rejected!", "Rider application has been rejected.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to reject rider.", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Rider Applications</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-[#CAEB66] text-black">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Region</th>
              <th>District</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRiders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.phone}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td className="flex flex-col gap-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => handleApprove(rider._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleReject(rider._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Full Rider Info */}
      {selectedRider && (
        <dialog id="rider_modal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-2">Rider Application Details</h3>
            <div className="space-y-1">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Phone:</strong> {selectedRider.phone}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>Age:</strong> {selectedRider.age}</p>
              <p><strong>National ID:</strong> {selectedRider.nid}</p>
              <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand}</p>
              <p><strong>Bike Reg No:</strong> {selectedRider.bikeRegNumber}</p>
              <p><strong>Additional Info:</strong> {selectedRider.additionalInfo}</p>
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="font-medium">NID Image:</p>
                  <img src={selectedRider.nidImage} alt="NID" className="h-32 rounded border" />
                </div>
                <div>
                  <p className="font-medium">Bike Image:</p>
                  <img src={selectedRider.bikeImage} alt="Bike" className="h-32 rounded border" />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-[#03373D]"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
