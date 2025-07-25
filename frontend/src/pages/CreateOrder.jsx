import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { addressEndpoints, orderEndpoints, paymentEndpoints } from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { resetCart } from "../slices/cartSlice";

const CreateOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector(state => state.auth.userData?._id);
  const product = useSelector(state => state.product.productData);
  const user = useSelector(state => state.auth.userData);
  const cartItems = useSelector(state => state.cart.cart || []); // Updated to use cart array
  const cartTotal = useSelector(state => state.cart.total || 0);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isFromCart, setIsFromCart] = useState(false);

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

  // Function to reset all form data to initial state
  const resetFormData = () => {
    setSelectedAddress(null);
    setNotes("");
    setPaymentMethod("COD");
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
  };

  // Function to handle successful order placement
  const handleOrderSuccess = () => {
    toast.success("Order placed successfully!");
    
    // Clear cart only if order was from cart
    if (isFromCart) {
      dispatch(resetCart());
    }
    
    // Reset form data
    resetFormData();
    
    // Navigate to home page
    navigate("/Home");
  };

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

  // Calculate order totals
  const calculateOrderTotals = () => {
    if (isFromCart && cartItems.length > 0) {
      // For cart orders, use cart total and calculate additional fees
      const subtotal = cartTotal;
      const shippingFee = 50; // You might want to calculate this based on cart items
      const tax = Math.round(subtotal * 0.05);
      const discount = 0;
      const total = subtotal + shippingFee + tax;
      
      return { subtotal, shippingFee, tax, discount, total };
    } else if (product) {
      // For single product orders
      const subtotal = product.price;
      const shippingFee = 50;
      const tax = Math.round(subtotal * 0.05);
      const discount = 0;
      const total = subtotal + shippingFee + tax;
      
      return { subtotal, shippingFee, tax, discount, total };
    }
    
    return { subtotal: 0, shippingFee: 0, tax: 0, discount: 0, total: 0 };
  };

  // Prepare order items
  const prepareOrderItems = () => {
    if (isFromCart && cartItems.length > 0) {
      // For cart orders, map all cart items
      return cartItems.map(item => ({
        productId: item._id || item.id,
        quantity: item.quantity || 1,
        name: item.name,
        price: item.price
      }));
    } else if (product) {
      // For single product orders
      return [{
        productId: product._id,
        quantity: 1,
        name: product.name,
        price: product.price
      }];
    }
    
    return [];
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    const orderItems = prepareOrderItems();
    if (orderItems.length === 0) {
      toast.error("No items to order");
      return;
    }

    const { subtotal, shippingFee, tax, discount, total } = calculateOrderTotals();

    const orderPayload = {
      userId,
      items: orderItems,
      shippingAddress: selectedAddress,
      billingAddress: selectedAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      discount,
      total,
      notes,
      isFromCart // Flag to indicate if this is a cart order
    };

    if (paymentMethod === "COD") {
      // COD: place order directly
      try {
        const res = await apiConnector("POST", orderEndpoints.createOrder, orderPayload);
        if (res.data.success) {
          handleOrderSuccess();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Order failed");
      }
    } else {
      // Razorpay flow
      try {
        // Step 1: Create Razorpay order
        const rpOrderRes = await apiConnector("POST", paymentEndpoints.createPayment, {
          amount: total,
          receipt: `order_${Date.now()}`,
        });

        if (!rpOrderRes.data.success) throw new Error("Payment gateway error");

        const { order } = rpOrderRes.data;

        // Step 2: Launch Razorpay checkout
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: order.amount,
          currency: order.currency,
          name: "UKF E-Commerce",
          description: isFromCart ? `Payment for ${orderItems.length} items` : "Order payment",
          order_id: order.id,
          handler: async (response) => {
            // Step 3: Verify payment
            try {
              const verifyRes = await apiConnector("POST", paymentEndpoints.verifyPayment, response);
              if (verifyRes.data.success) {
                // Step 4: Place final order
                const finalRes = await apiConnector("POST", orderEndpoints.createOrder, {
                  ...orderPayload,
                  paymentId: response.razorpay_payment_id,
                });
                if (finalRes.data.success) {
                  handleOrderSuccess();
                }
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              console.log(error);
              toast.error("Error verifying payment");
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: {
            color: "#FFD700",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error(error.message || "Payment initiation failed");
      }
    }
  };

  // Check if current order is from cart
  useEffect(() => {
    if (userId) fetchAddresses();
    
    // Method 1: Check via URL state/search params
    const urlParams = new URLSearchParams(location.search);
    const fromCart = urlParams.get('fromCart');
    
    // Method 2: Check via location state
    const locationState = location.state;
    
    // Method 3: Check if we have cart items and no single product
    const hasCartItems = cartItems && cartItems.length > 0;
    const hasProduct = product && Object.keys(product).length > 0;
    
    // Set isFromCart based on the methods
    const fromCartFlag = fromCart === 'true' || 
                        locationState?.fromCart === true || 
                        (hasCartItems && !hasProduct);
    
    setIsFromCart(fromCartFlag);
    
    console.log('Order source detection:', {
      fromCartParam: fromCart,
      locationState: locationState?.fromCart,
      hasCartItems,
      hasProduct,
      finalDecision: fromCartFlag
    });
    
  }, [userId, product, cartItems, location]);

  // Get items to display
  const itemsToDisplay = isFromCart ? cartItems : (product ? [product] : []);
  const { subtotal, shippingFee, tax, total } = calculateOrderTotals();

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
        <h1 className="text-2xl font-bold">
          Confirm Your Order {isFromCart && `(${itemsToDisplay.length} items)`}
        </h1>

        {/* Order Summary */}
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded-lg space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          {itemsToDisplay.map((item, index) => (
            <div key={item._id || item.id || index} className="flex items-center gap-4 p-3 border-b border-gray-700 last:border-b-0">
              <img
                src={item?.images?.[0]?.url}
                alt="Product"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item?.name}</h3>
                <p className="text-sm text-gray-400">
                  Price: ₹{item?.price} {isFromCart && `× ${item?.quantity || 1}`}
                </p>
                {isFromCart && (
                  <p className="text-sm font-semibold">
                    Subtotal: ₹{(item?.price * (item?.quantity || 1))}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {/* Order Total */}
          <div className="border-t border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹{shippingFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
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
            disabled={!selectedAddress || itemsToDisplay.length === 0}
            className="w-full bg-[#FFD700] text-black font-bold py-3 rounded hover:brightness-110 disabled:opacity-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            Place Order - ₹{total}
          </motion.button>
        </div>
      </motion.div>

      {/* Modal for adding address - keeping the same as before */}
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