import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { addressEndpoints, orderEndpoints } from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const CreateOrder = () => {
  const userId = useSelector(state => state.auth.userData?._id);
  const product = useSelector(state => state.product.productData);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [formData, setFormData] = useState({
    recipientName: "",
    addressType: "Home",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    landmark: "",
    instructions: "",
    isDefault: false
  });

  const fetchAddresses = async () => {
    try {
      const res = await apiConnector("GET", `${addressEndpoints.getUserAddress}${userId}`);
      if (res.data.success) {
        setAddresses(res.data.addresses);
        const defaultAddr = res.data.addresses.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
      }
    } catch (error) {
      console.log("Error while fetching addresses", error);
      toast.error("Failed to load addresses");
    }
  };

  const handleAddAddress = async () => {
    try {
      setAddingAddress(true);
      await apiConnector("POST", addressEndpoints.createAddress, {
        userId,
        ...formData
      });
      toast.success("Address added");
      setShowModal(false);
      setFormData({
        recipientName: "",
        addressType: "Home",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        phone: "",
        landmark: "",
        instructions: "",
        isDefault: false
      });
      fetchAddresses();
    } catch (error) {
      console.error("Failed to add address:", error);
      toast.error("Failed to add address");
    } finally {
      setAddingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !product) {
      toast.error("Select address and product");
      return;
    }

    const subtotal = product.price;
    const shippingFee = 50;
    const tax = Math.round(subtotal * 0.05);
    const discount = 0;
    const total = subtotal + shippingFee + tax;

    const payload = {
      userId,
      items: [{
        productId: product._id,
        quantity: 1,
        name: product.name,
        price: product.price
      }],
      shippingAddress: selectedAddress,
      billingAddress: selectedAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      discount,
      total,
      notes
    };

    try {
      const res = await apiConnector("POST", orderEndpoints.createOrder, payload);
      if (res.data.success) {
        toast.success("Order placed successfully");
        // Navigate or reset as needed
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    }
  };

  useEffect(() => {
    if (userId) fetchAddresses();
  }, [userId]);

  return (
    <motion.div
      className="bg-black text-[#FFD700] min-h-screen p-6 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold">Confirm Your Order</h1>

        {/* Product Summary */}
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded-lg flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={product?.images?.[0]?.url}
            alt="Product"
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h2 className="font-semibold text-lg">{product?.name}</h2>
            <p>Price: ₹{product?.price}</p>
          </div>
        </motion.div>

        {/* Address Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Shipping Address</h2>
          {addresses.length === 0 ? (
            <p className="text-gray-400">No addresses found.</p>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <motion.label
                  key={addr._id}
                  className="flex gap-2 items-start p-3 border border-[#FFD700] rounded cursor-pointer hover:bg-[#111]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <input
                    type="radio"
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                    className="mt-1 accent-[#FFD700]"
                  />
                  <div>
                    <div className="font-semibold">{addr.recipientName}</div>
                    <div>{addr.street}, {addr.city}, {addr.state}, {addr.postalCode}</div>
                    <div>{addr.country}</div>
                    <div>Phone: {addr.phone}</div>
                  </div>
                </motion.label>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-[#FFD700] text-black px-4 py-2 rounded hover:brightness-110"
          >
            + Add Address
          </button>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <textarea
            placeholder="Order notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded border bg-[#111] text-[#FFD700]"
          />
        </div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block font-semibold mb-2">Choose Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-[#111] text-[#FFD700]"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Wallet">Wallet</option>
          </select>
        </motion.div>

        {/* Place Order */}
        <div className="mt-6">
          <motion.button
            onClick={handlePlaceOrder}
            disabled={!selectedAddress}
            className="w-full bg-[#FFD700] text-black font-bold py-3 rounded hover:brightness-110 disabled:opacity-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            Place Order
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="hidescroll mt-28 bg-white text-black p-6 rounded-lg w-[90%] max-w-lg overflow-y-auto max-h-[70vh]"
          >
                        <h2 className="text-xl font-bold mb-4">Add New Address</h2>
            {[
              "recipientName", "street", "city", "state",
              "postalCode", "country", "phone", "landmark", "instructions"
            ].map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full p-2 mb-3 border rounded"
              />
            ))}

            <select
              value={formData.addressType}
              onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
              className="w-full p-2 mb-3 border rounded"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              Set as default address
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                className="px-4 py-2 bg-[#FFD700] text-black rounded font-semibold"
              >
                {addingAddress ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CreateOrder;
