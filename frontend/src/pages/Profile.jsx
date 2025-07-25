import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { endpoints, orderEndpoints } from '../services/api';
import { Edit3, Save, X, Package, Eye, XCircle, Calendar, MapPin, Phone, Mail, User, Settings, ShoppingBag } from 'lucide-react';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchProfile();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiConnector('GET', `${endpoints.getProfile}${user._id}`);
      if (response.data.success) {
        setProfileData(response.data.user);
      }
    } catch (error) {
        console.log("fetching profile",error)
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await apiConnector('GET', orderEndpoints.getUserOrders);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
        console.log("fetching orders",error)
      toast.error('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValues({ [field]: currentValue });
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleSave = async (field) => {
    try {
      const updateData = {};
      if (field.includes('profile.')) {
        const profileField = field.replace('profile.', '');
        updateData.profile = { ...profileData.profile, [profileField]: tempValues[field] };
      } else {
        updateData[field] = tempValues[field];
      }

      const response = await apiConnector('PUT', `${endpoints.updateProfile}${user._id}`, updateData);
      
      if (response.data.success) {
        setProfileData(response.data.user);
        setEditingField(null);
        setTempValues({});
        toast.success('Profile updated successfully');
      }
    } catch (error) {
        console.log("updating profile",error)
      toast.error('Failed to update profile');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await apiConnector('PUT', `${orderEndpoints.cancelOrder}${orderId}`);
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
        console.log("cancelling order",error)
      toast.error('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'text-blue-400',
      'Processing': 'text-yellow-400',
      'Shipped': 'text-purple-400',
      'Delivered': 'text-green-400',
      'Cancelled': 'text-red-400',
      'Return Requested': 'text-orange-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const EditableField = ({ label, field, value, type = 'text', icon: Icon }) => {
    const isEditing = editingField === field;
    
    return (
      <div className={`group p-4 rounded-lg bg-[#1a1a1a] border border-transparent hover:border-[#ecba49]/30 transition-all duration-300 hover:shadow-lg ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {Icon && <Icon size={20} className="text-[#ecba49]" />}
            <div className="flex-1">
              <label className="text-sm text-gray-400 block mb-1">{label}</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type={type}
                    value={tempValues[field] || ''}
                    onChange={(e) => setTempValues(prev => ({ ...prev, [field]: e.target.value }))}
                    className="bg-black border border-[#ecba49] rounded px-3 py-2 text-[#ecba49] focus:outline-none focus:ring-2 focus:ring-[#ecba49]/50 transition-all duration-300 flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave(field)}
                    className="p-2 bg-green-600 rounded hover:bg-green-700 transition-colors duration-300 hover:scale-110 active:scale-95"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors duration-300 hover:scale-110 active:scale-95"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-[#ecba49] font-medium group-hover:text-yellow-300 transition-colors duration-300">
                  {value || 'Not specified'}
                </div>
              )}
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => handleEdit(field, value)}
              className="opacity-0 group-hover:opacity-100 p-2 text-[#ecba49] hover:text-yellow-300 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Edit3 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const OrderCard = ({ order, index }) => (
    <div 
      className={`bg-[#1a1a1a] rounded-lg p-6 border border-transparent hover:border-[#ecba49]/30 transition-all duration-500 hover:shadow-lg hover:scale-105 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[#ecba49] font-bold text-lg hover:text-yellow-300 transition-colors duration-300">
            Order #{order.orderId}
          </h3>
          <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
            <Calendar size={14} />
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.currentStatus)} bg-black/50 hover:scale-110 transition-transform duration-300`}>
          {order.currentStatus}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-300 mb-2">Items: {order.items.length}</p>
        <p className="text-[#ecba49] font-bold text-xl hover:text-yellow-300 transition-colors duration-300">
          ₹{order.total}
        </p>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedOrder(order)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ecba49] text-black rounded hover:brightness-110 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Eye size={16} />
          View Details
        </button>
        
        {['Order Placed', 'Payment Pending', 'Payment Received'].includes(order.currentStatus) && (
          <button
            onClick={() => cancelOrder(order._id)}
            className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <XCircle size={16} />
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  if (showOrders) {
    return (
      <div className="min-h-screen bg-black text-[#ecba49] p-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Orders Header */}
          <div className={`flex justify-between items-center mb-8 transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
            <h1 className="text-3xl font-bold flex items-center gap-3 hover:text-yellow-300 transition-colors duration-300">
              <ShoppingBag className="animate-bounce" />
              My Orders
            </h1>
            <button
              onClick={() => {
                setShowOrders(false);
                setIsVisible(false);
                setTimeout(() => setIsVisible(true), 100);
              }}
              className="px-6 py-3 border border-[#ecba49] rounded-lg hover:bg-[#ecba49] hover:text-black transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Back to Profile
            </button>
          </div>

          {/* Orders Grid */}
          {ordersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#ecba49] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order, index) => (
                <OrderCard key={order._id} order={order} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto mb-4 text-gray-600 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="text-gray-400">Your order history will appear here</p>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#ecba49]/30 animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#ecba49]">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-red-600 rounded transition-all duration-300 hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Order ID</p>
                    <p className="text-[#ecba49] font-semibold">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status</p>
                    <p className={`font-semibold ${getStatusColor(selectedOrder.currentStatus)}`}>
                      {selectedOrder.currentStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Amount</p>
                    <p className="text-[#ecba49] font-bold">₹{selectedOrder.total}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment Method</p>
                    <p className="text-white">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#ecba49]">Items Ordered</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-black/50 rounded">
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-[#ecba49] font-semibold">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ecba49] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#ecba49] animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#ecba49] p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`flex justify-between items-center mb-8 transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
          <h1 className="text-3xl font-bold flex items-center gap-3 hover:text-yellow-300 transition-colors duration-300">
            <User className="animate-pulse" />
            My Profile
          </h1>
          <button
            onClick={() => {
              setShowOrders(true);
              setIsVisible(false);
              setTimeout(() => {
                setIsVisible(true);
                fetchOrders();
              }, 100);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#ecba49] text-black rounded-lg font-semibold hover:brightness-110 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Package size={20} />
            My Orders
          </button>
        </div>

        {/* Profile Image Section */}
        <div className={`text-center mb-8 transition-all duration-800 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative inline-block group">
            <img
              src={profileData?.image || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-[#ecba49] object-cover transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <Settings className="text-white animate-spin-slow" size={24} />
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold mb-4 text-[#ecba49] transition-all duration-800 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              Basic Information
            </h2>
            
            <EditableField
              label="Full Name"
              field="name"
              value={profileData?.name}
              icon={User}
            />
            
            <EditableField
              label="Phone Number"
              field="phone"
              value={profileData?.phone}
              type="tel"
              icon={Phone}
            />
            
            <EditableField
              label="Age"
              field="profile.age"
              value={profileData?.profile?.age}
              type="number"
              icon={Calendar}
            />
            
            <EditableField
              label="Gender"
              field="profile.gender"
              value={profileData?.profile?.gender}
              icon={User}
            />
            
            <EditableField
              label="Date of Birth"
              field="profile.dateOfBirth"
              value={profileData?.profile?.dateOfBirth?.split('T')[0]}
              type="date"
              icon={Calendar}
            />
          </div>

          {/* Address & Other Info */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold mb-4 text-[#ecba49] transition-all duration-800 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
              Address & Details
            </h2>
            
            <EditableField
              label="Address"
              field="profile.address"
              value={profileData?.profile?.address}
              icon={MapPin}
            />
            
            <EditableField
              label="City"
              field="profile.city"
              value={profileData?.profile?.city}
              icon={MapPin}
            />
            
            <EditableField
              label="State"
              field="profile.state"
              value={profileData?.profile?.state}
              icon={MapPin}
            />
            
            <EditableField
              label="Zip Code"
              field="profile.zipCode"
              value={profileData?.profile?.zipCode}
              icon={MapPin}
            />
            
            <EditableField
              label="Country"
              field="profile.country"
              value={profileData?.profile?.country}
              icon={MapPin}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className={`mt-8 space-y-4 transition-all duration-800 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-xl font-semibold mb-4 text-[#ecba49]">Additional Information</h2>
          
          <EditableField
            label="Occupation"
            field="profile.occupation"
            value={profileData?.profile?.occupation}
            icon={Settings}
          />
          
          <EditableField
            label="Bio"
            field="profile.bio"
            value={profileData?.profile?.bio}
            icon={User}
          />
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;