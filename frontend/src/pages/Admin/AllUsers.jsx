import React, { useEffect, useState, useContext } from "react";
import AdminDashLayout from "../../components/layouts/AdminDashLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { toast } from "react-toastify";

const AllUsers = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await axiosInstance.delete(`/api/users/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <AdminDashLayout activeMenu="Users">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">All Users</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            {/* TABLE VIEW FOR DESKTOP */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full text-left border border-gray-200 text-sm sm:text-base">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 border-b">ID</th>
                    <th className="py-3 px-4 border-b">User</th>
                    <th className="py-3 px-4 border-b">Email</th>
                    <th className="py-3 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{u._id}</td>
                        <td className="py-2 px-4 flex items-center gap-2">
                          <img
                            src={u.profileImageUrl || "/default-avatar.png"}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{u.name || "No Name"}</span>
                        </td>
                        <td className="py-2 px-4">{u.email}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE / TABLET CARD VIEW */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {users.length === 0 ? (
                <p className="text-center text-gray-500">No users found.</p>
              ) : (
                users.map((u) => (
                  <div
                    key={u._id}
                    className="border rounded-md p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-center mb-3">
                      <img
                        src={u.profileImageUrl || "/default-avatar.png"}
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="text-center mb-2">
                      <p className="font-semibold text-lg">{u.name || "No Name"}</p>
                      <p className="text-gray-600">{u.email}</p>
                      <p className="text-sm text-gray-400 mt-1">ID: {u._id}</p>
                    </div>
                    <div className="flex justify-center mt-3">
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-[90%]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{userToDelete.name}</span>?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashLayout>
  );
};

export default AllUsers;
