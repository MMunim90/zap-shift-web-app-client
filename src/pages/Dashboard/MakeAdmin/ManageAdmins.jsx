import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dayjs from "dayjs";
const ManageAdmins = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText) return;

    setLoading(true);
    try {
      const res = await axiosSecure.get(`/users/search?email=${searchText}`);
      setUsers(res.data);
    } catch (error) {
      console.error("Search failed:", error);
      Swal.fire("Error", "Failed to search users", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to change role to ${newRole}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, change to ${newRole}`,
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/admin/${id}`, { role: newRole });
        Swal.fire("Success", "Role updated successfully", "success");
        // Refresh the list
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
      } catch (error) {
        Swal.fire("Error", "Failed to update role", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by email"
          className="input input-bordered w-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="btn bg-[#CAEB66] text-black">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-[#CAEB66] text-sm text-black">
                <th>Email</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>
                    {dayjs(user.creation_date).format("DD-MM-YYYY")}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin"
                          ? "badge-success"
                          : "badge-neutral"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-xs ${
                        user.role === "admin"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white`}
                      onClick={() => toggleAdminRole(user._id, user.role)}
                    >
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        searchText &&
        !loading && <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default ManageAdmins;
