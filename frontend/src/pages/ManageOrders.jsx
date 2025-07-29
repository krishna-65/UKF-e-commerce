import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { orderEndpoints } from "../services/api";
import { setLoading } from "../slices/authSlice";
import toast from "react-hot-toast";

const {
  getAllOrders,
  updateOrderStatus,
  addTrackingInfo,
} = orderEndpoints;

const ManageOrders = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  const token = useSelector(state => state.auth.token)

  const fetchOrders = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", `${getAllOrders}?page=${page}&limit=10`,null,{
        Authorization : `Bearer ${token}`
      });
      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.pages);
        toast.success("Orders fetched!");
      }
    } catch (err) {
      toast.error("Unable to fetch orders");
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusUpdate = async () => {
    try {
      await apiConnector("PUT", `${updateOrderStatus}${selectedOrder._id}/status`, {
        status: newStatus,
        note: "Updated via admin panel",
      },{
        Authorization : `Bearer ${token}`
      });
      toast.success("Order status updated!");
      fetchOrders();
      setShowStatusModal(false);
      setNewStatus("");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      await apiConnector("PUT", `${addTrackingInfo}${selectedOrder._id}/tracking`, {
        paymentStatus: newPaymentStatus,
      },{
        Authorization : `Bearer ${token}`
      });
      toast.success("Payment status updated!");
      fetchOrders();
      setShowPaymentModal(false);
      setNewPaymentStatus("");
    } catch (error) {
      toast.error("Failed to update payment status");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  return (
    <div className="manage-orders hidescroll text-[#FFD700] lg:w-[calc(100vw-256px)] overflow-y-scroll h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full min-w-[900px] bg-white text-black">
              <thead className="bg-[#FFD700]">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Items</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Payment</th>
                  <th className="px-4 py-2 text-left">Placed On</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-200 hover:bg-[#f9f9f9]">
                    <td className="px-4 py-2 font-semibold">{order.orderId}</td>
                    <td className="px-4 py-2">
                      {order.user?.name}
                      <br />
                      <span className="text-sm text-gray-500">{order.user?.email}</span>
                    </td>
                    <td className="px-4 py-2">{order.items.length} item(s)</td>
                    <td className="px-4 py-2 font-bold">₹{order.total}</td>
                    <td className="px-4 py-2">{order.currentStatus}</td>
                    <td className="px-4 py-2">{order.paymentStatus}</td>
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="mr-2 px-2 py-1 bg-blue-600 text-white rounded text-sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowStatusModal(true);
                          setNewStatus("");
                        }}
                      >
                        Update Status
                      </button>
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowPaymentModal(true);
                          setNewPaymentStatus("");
                        }}
                      >
                        Update Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-[#FFD700] text-black font-bold"
                    : "border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Status Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-3xl bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] text-black">
            <h3 className="text-xl font-bold mb-4">
              Update Status: {selectedOrder.orderId}
            </h3>
            <select
              className="w-full mb-4 p-2 border rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="" disabled>Select new status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus}
                className="px-4 py-2 bg-[#FFD700] text-black font-semibold rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-3xl bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] text-black">
            <h3 className="text-xl font-bold mb-4">
              Update Payment: {selectedOrder.orderId}
            </h3>
            <select
              className="w-full mb-4 p-2 border rounded"
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
            >
              <option value="" disabled>Select payment status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
                            <option value="Refunded">Refunded</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
              <button
                onClick={handlePaymentUpdate}
                disabled={!newPaymentStatus}
                className="px-4 py-2 bg-[#FFD700] text-black font-semibold rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
