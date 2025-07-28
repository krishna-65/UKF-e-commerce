import React, { useEffect, useState } from 'react';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/api';
import { toast } from 'react-hot-toast';
import { Eye, X } from 'lucide-react';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiConnector("GET", `${endpoints.getUser}?page=${page}`);
      if (res.data.success) {
        setUsers(res.data.users || []);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      } else {
        throw new Error("Failed to load users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="p-4 bg-[#fafafa] min-h-screen lg:min-w-[1600px] text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#222]">All Users</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="lg:min-w-[700px] w-full bg-white rounded">
          <thead className="bg-[#FFD770] text-[#222]">
            <tr>
              <th className="px-4 py-2 text-left">Sr. No.</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Orders</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center">Loading...</td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, idx) => (
                <tr key={user._id} className="border-t hover:bg-[#f5f5f5] transition duration-300">
                  <td className="px-4 py-2">{(currentPage - 1) * 10 + idx + 1}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2">{user.totalOrders || 0}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-[#FFD770] text-black px-3 py-1 rounded hover:brightness-110 transition hover:scale-105"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-[#FFD770] text-black rounded hover:scale-105 transition"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <span className="py-2 text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-[#FFD770] text-black rounded hover:scale-105 transition"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-[#222] max-w-xl w-full rounded-lg p-6 overflow-y-auto max-h-[80vh] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Total Orders:</strong> {selectedUser.totalOrders}</p>
              <p><strong>Total Spent:</strong> ₹{selectedUser.totalSpent}</p>
              {selectedUser.profile && (
                <>
                  <p><strong>Age:</strong> {selectedUser.profile.age}</p>
                  <p><strong>Gender:</strong> {selectedUser.profile.gender}</p>
                  <p><strong>DOB:</strong> {new Date(selectedUser.profile.dateOfBirth).toLocaleDateString()}</p>
                  <p><strong>Address:</strong> {selectedUser.profile.address}, {selectedUser.profile.city}, {selectedUser.profile.state}, {selectedUser.profile.zipCode}, {selectedUser.profile.country}</p>
                  <p><strong>Occupation:</strong> {selectedUser.profile.occupation}</p>
                  <p><strong>Bio:</strong> {selectedUser.profile.bio}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
