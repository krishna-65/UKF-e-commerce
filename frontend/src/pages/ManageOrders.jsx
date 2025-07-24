import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { orderEndpoints } from "../services/api";
import { setLoading } from "../slices/authSlice";
import toast from "react-hot-toast";

const { getAllOrders } = orderEndpoints;

const ManageOrders = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", `${getAllOrders}?page=${page}&limit=10`);
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

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="manage-orders  text-[#FFD700] lg:w-[calc(100vw-256px)] min-h-screen p-6">
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
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-200 hover:bg-[#f9f9f9]">
                    <td className="px-4 py-2 font-semibold">{order.orderId}</td>
                    <td className="px-4 py-2">
                      {order.user?.name}<br />
                      <span className="text-sm text-gray-500">{order.user?.email}</span>
                    </td>
                    <td className="px-4 py-2">{order.items.length} item(s)</td>
                    <td className="px-4 py-2 font-bold">₹{order.total}</td>
                    <td className="px-4 py-2">{order.currentStatus}</td>
                    <td className="px-4 py-2">{order.paymentStatus}</td>
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
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
    </div>
  );
};

export default ManageOrders;
