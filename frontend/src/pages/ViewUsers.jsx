import React, { useEffect, useState } from 'react';
import { apiConnector } from '../services/apiConnector';
import { endpoints } from '../services/api';
import { toast } from 'react-hot-toast';
import { Eye, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = useSelector(state => state.auth.token)

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiConnector("GET", `${endpoints.getUser}?page=${page}`,null,{
        Authorization : `Bearer ${token}`
      });
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
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-[#111] text-[#FFD770] max-w-xl w-full rounded-lg p-6 overflow-y-auto max-h-[85vh] shadow-[0_0_20px_rgba(255,215,112,0.3)] animate-scale-in border border-[#FFD770]/30">
      <div className="flex justify-between items-center mb-4 border-b border-[#FFD770]/20 pb-2">
        <h2 className="text-xl font-bold uppercase tracking-wide">User Details</h2>
        <button
          onClick={() => setSelectedUser(null)}
          className="text-[#FFD770] hover:text-white hover:bg-[#FFD770]/20 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-3 text-sm tracking-wide leading-relaxed">
        <p><span className="font-semibold">Name:</span> {selectedUser.name}</p>
        <p><span className="font-semibold">Phone:</span> {selectedUser.phone}</p>
        <p><span className="font-semibold">Total Orders:</span> {selectedUser.totalOrders}</p>
        <p><span className="font-semibold">Total Spent:</span> ₹{selectedUser.totalSpent}</p>

        {selectedUser.profile ? (
          <>
            <p><span className="font-semibold">Age:</span> {selectedUser.profile.age}</p>
            <p><span className="font-semibold">Gender:</span> {selectedUser.profile.gender}</p>
            <p><span className="font-semibold">DOB:</span> {new Date(selectedUser.profile.dateOfBirth).toLocaleDateString()}</p>
            <p><span className="font-semibold">Occupation:</span> {selectedUser.profile.occupation}</p>
            <p><span className="font-semibold">Bio:</span> {selectedUser.profile.bio}</p>
            <div>
              <span className="font-semibold">Address:</span>
              <p className="ml-2 mt-1 text-[#FFD770]/90">
                {selectedUser.profile.address}, {selectedUser.profile.city},<br />
                {selectedUser.profile.state}, {selectedUser.profile.zipCode}, {selectedUser.profile.country}
              </p>
            </div>
          </>
        ) : (
          <p className="italic text-[#FFD770]/70">No profile information available.</p>
        )}
      </div>
    </div>

    {/* Custom Animation */}
    <style jsx>{`
      @keyframes scale-in {
        0% { transform: scale(0.92); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-scale-in {
        animation: scale-in 0.3s ease-out;
      }
    `}</style>
  </div>
)}

    </div>
  );
};

export default ViewUsers;
