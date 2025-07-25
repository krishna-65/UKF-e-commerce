import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { endpoints, orderEndpoints } from '../services/api';
import { Edit3, Save, X, Package, Eye, XCircle, Calendar, MapPin, Phone, User, Settings, ShoppingBag } from 'lucide-react';

// Corrected EditableField to prevent cursor jumping
const EditableField = ({ label, field, value, type = 'text', icon: Icon, handleSave: parentHandleSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Manage input value locally to prevent cursor jumping
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    // Sync local state if the prop value changes from the parent
    setInputValue(value || '');
  }, [value]);

  const handleEdit = () => {
    // When editing starts, ensure the local state is up-to-date with the prop
    setInputValue(value || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    parentHandleSave(field, inputValue);
    setIsEditing(false);
  };

  const getDisplayValue = () => {
    if (type === 'date' && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    }
    return value || 'Not specified';
  };

  return (
    <div className={`group p-4 rounded-lg bg-[#1a1a1a] border border-transparent hover:border-[#ecba49]/30 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {Icon && <Icon size={20} className="text-[#ecba49]" />}
          <div className="flex-1">
            <label className="text-sm text-gray-400 block mb-1">{label}</label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                {type === 'select' ? (
                  <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-black border border-[#ecba49] rounded px-3 py-2 text-[#ecba49] focus:outline-none focus:ring-2 focus:ring-[#ecba49]/50 transition-all duration-300 flex-1"
                    autoFocus
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type={type}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-black border border-[#ecba49] rounded px-3 py-2 text-[#ecba49] focus:outline-none focus:ring-2 focus:ring-[#ecba49]/50 transition-all duration-300 flex-1"
                    autoFocus
                  />
                )}
                <button onClick={handleSaveClick} className="p-2 bg-green-600 rounded hover:bg-green-700 transition-colors duration-300 hover:scale-110 active:scale-95">
                  <Save size={16} />
                </button>
                <button onClick={handleCancel} className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors duration-300 hover:scale-110 active:scale-95">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-[#ecba49] font-medium group-hover:text-yellow-300 transition-colors duration-300">
                {getDisplayValue()}
              </div>
            )}
          </div>
        </div>
        {!isEditing && (
          <button onClick={handleEdit} className="opacity-0 group-hover:opacity-100 p-2 text-[#ecba49] hover:text-yellow-300 transition-all duration-300 hover:scale-110 active:scale-95">
            <Edit3 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// Component for Date of Birth Dropdowns
const EditableDOBField = ({ label, field, value, icon: Icon, handleSave: parentHandleSave }) => {
    const [isEditing, setIsEditing] = useState(false);

    const getInitialDate = () => {
        const date = value ? new Date(value) : null;
        if (date && !isNaN(date.getTime())) {
            return {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            };
        }
        return { day: '', month: '', year: '' };
    };

    const [day, setDay] = useState(getInitialDate().day);
    const [month, setMonth] = useState(getInitialDate().month);
    const [year, setYear] = useState(getInitialDate().year);

    const handleEdit = () => {
        const { day, month, year } = getInitialDate();
        setDay(day);
        setMonth(month);
        setYear(year);
        setIsEditing(true);
    };

    const handleCancel = () => setIsEditing(false);

    const handleSaveClick = () => {
        if (day && month && year) {
            const newDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            parentHandleSave(field, newDate);
            setIsEditing(false);
        } else {
            toast.error("Please select a valid date.");
        }
    };

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className={`group p-4 rounded-lg bg-[#1a1a1a] border border-transparent hover:border-[#ecba49]/30 transition-all duration-300 hover:shadow-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    {Icon && <Icon size={20} className="text-[#ecba49]" />}
                    <div className="flex-1">
                        <label className="text-sm text-gray-400 block mb-1">{label}</label>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <select value={day} onChange={(e) => setDay(e.target.value)} className="bg-black border border-[#ecba49] rounded px-2 py-2 text-[#ecba49] focus:outline-none focus:ring-2 focus:ring-[#ecba49]/50 w-full">
                                    <option value="">Day</option>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select value={month} onChange={(e) => setMonth(e.target.value)} className="bg-black border border-[#ecba49] rounded px-2 py-2 text-[#ecba49] focus:outline-none focus:ring-2 focus:ring-[#ecba49]/50 w-full">
                                    <option value="">Month</option>
                                    {months.map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>)}
                                </select>
                                <select value={year} onChange={(e) => setYear(e.target.value)} className="bg-black border border-[#ecba49] rounded px-2 py-2 text-[#ecba49] focus:outline-none focus:ring-2 focus:ring-[#ecba49]/50 w-full">
                                    <option value="">Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <button onClick={handleSaveClick} className="p-2 bg-green-600 rounded hover:bg-green-700 transition-colors duration-300 hover:scale-110 active:scale-95"><Save size={16} /></button>
                                <button onClick={handleCancel} className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors duration-300 hover:scale-110 active:scale-95"><X size={16} /></button>
                            </div>
                        ) : (
                            <div className="text-[#ecba49] font-medium group-hover:text-yellow-300 transition-colors duration-300">
                                {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}
                            </div>
                        )}
                    </div>
                </div>
                {!isEditing && (
                    <button onClick={handleEdit} className="opacity-0 group-hover:opacity-100 p-2 text-[#ecba49] hover:text-yellow-300 transition-all duration-300 hover:scale-110 active:scale-95">
                        <Edit3 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

const Profile = () => {
    const user = useSelector((state) => state.auth.userData);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // State and ref for picture upload
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const fileInputRef = useRef(null);

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
          console.log("error whil fetching profile",error)
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };
const token = useSelector((state)=>state.auth.token)

    const fetchOrders = async () => {

      
        try {
            setOrdersLoading(true);
            const response = await apiConnector('GET', orderEndpoints.getUserOrders,null,{
              Authorization: `Bearer ${token}`
            });

            console.log(response)

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
          console.log("error while fetchingorder",error)
            toast.error('Failed to fetch orders');
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleSave = async (field, value) => {
        try {
            const updateData = {};
            if (field.includes('profile.')) {
                const profileField = field.replace('profile.', '');
                updateData.profile = { ...profileData.profile, [profileField]: value };
            } else {
                updateData[field] = value;
            }

            const response = await apiConnector('PUT', `${endpoints.updateProfile}${user._id}`, updateData);

            if (response.data.success) {
                setProfileData(response.data.user);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
          console.log("error while update profile" ,error)
            toast.error('Failed to update profile');
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const response = await apiConnector('PUT', `${orderEndpoints.cancelOrder}${orderId}/cancel`);
            if (response.data.success) {
                toast.success('Order cancelled successfully');
                fetchOrders();
            }
        } catch (error) {
          console.log("error while cancelling",error)
            toast.error('Failed to cancel order');
        }
    };

    // Functions to handle picture upload
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('updatePicture', file);

        setImageUploadLoading(true);
        try {
            const response = await apiConnector("PATCH", `${endpoints.updatePicture}${user._id}`, formData);
            if (response.data.success) {
                toast.success("Profile Picture Updated!");
                setProfileData(response.data.user);
            } else {
                toast.error(response.data.message || "Failed to update picture.");
            }
        } catch (error) {
            console.error("PICTURE_UPDATE_ERROR", error);
            toast.error("Could not update profile picture.");
        } finally {
            setImageUploadLoading(false);
            e.target.value = null; 
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
    
    const OrderCard = ({ order, index }) => (
        <div
            className={`bg-[#1a1a1a] rounded-lg p-6 border border-transparent hover:border-[#ecba49]/30 transition-all duration-500 hover:shadow-lg hover:scale-105 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-[#ecba49] font-bold text-lg hover:text-yellow-300 transition-colors duration-300">Order #{order.orderId}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1"><Calendar size={14} />{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.currentStatus)} bg-black/50 hover:scale-110 transition-transform duration-300`}>{order.currentStatus}</span>
            </div>
            <div className="mb-4">
                <p className="text-gray-300 mb-2">Items: {order.items.length}</p>
                <p className="text-[#ecba49] font-bold text-xl hover:text-yellow-300 transition-colors duration-300">₹{order.total}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setSelectedOrder(order)} className="flex items-center gap-2 px-4 py-2 bg-[#ecba49] text-black rounded hover:brightness-110 transition-all duration-300 hover:scale-105 active:scale-95"><Eye size={16} />View Details</button>
                {['Order Placed', 'Payment Pending', 'Payment Received'].includes(order.currentStatus) && (
                    <button onClick={() => cancelOrder(order._id)} className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"><XCircle size={16} />Cancel</button>
                )}
            </div>
        </div>
    );

    if (showOrders) {
        return (
            <div className="min-h-screen bg-black text-[#ecba49] p-6 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className={`flex justify-between items-center mb-8 transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
                        <h1 className="text-3xl font-bold flex items-center gap-3 hover:text-yellow-300 transition-colors duration-300"><ShoppingBag className="animate-bounce" />My Orders</h1>
                        <button onClick={() => { setShowOrders(false); setIsVisible(false); setTimeout(() => setIsVisible(true), 100); }} className="px-6 py-3 border border-[#ecba49] rounded-lg hover:bg-[#ecba49] hover:text-black transition-all duration-300 hover:scale-105 active:scale-95">Back to Profile</button>
                    </div>
                    {ordersLoading ? (
                        <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-[#ecba49] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : orders.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {orders.map((order, index) => (<OrderCard key={order._id} order={order} index={index} />))}
                        </div>
                    ) : (
                        <div className="text-center py-20"><Package size={64} className="mx-auto mb-4 text-gray-600 animate-pulse" /><h3 className="text-xl font-semibold mb-2">No Orders Yet</h3><p className="text-gray-400">Your order history will appear here</p></div>
                    )}
                </div>
                {selectedOrder && (
                    <div className="fixed inset-0  flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-[#1a1a1a] mt-32 hidescroll rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#ecba49]/30 animate-scale-in">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#ecba49]">Order Details</h2>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-red-600 rounded transition-all duration-300 hover:scale-110"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-gray-400">Order ID</p><p className="text-[#ecba49] font-semibold">{selectedOrder.orderId}</p></div>
                                    <div><p className="text-gray-400">Status</p><p className={`font-semibold ${getStatusColor(selectedOrder.currentStatus)}`}>{selectedOrder.currentStatus}</p></div>
                                    <div><p className="text-gray-400">Total Amount</p><p className="text-[#ecba49] font-bold">₹{selectedOrder.total}</p></div>
                                    <div><p className="text-gray-400">Payment Method</p><p className="text-white">{selectedOrder.paymentMethod}</p></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-[#ecba49]">Items Ordered</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-black/50 rounded">
                                                <div><p className="text-white font-medium">{item.name}</p><p className="text-gray-400">Qty: {item.quantity}</p></div>
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
                <div className="text-center"><div className="w-16 h-16 border-4 border-[#ecba49] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-[#ecba49] animate-pulse">Loading Profile...</p></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-[#ecba49] p-6 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className={`flex justify-between items-center mb-8 transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
                    <h1 className="text-3xl font-bold flex items-center gap-3 hover:text-yellow-300 transition-colors duration-300"><User className="animate-pulse" /> My Profile</h1>
                    <button onClick={() => { setShowOrders(true); setIsVisible(false); setTimeout(() => { setIsVisible(true); fetchOrders(); }, 100); }} className="flex items-center gap-2 px-6 py-3 bg-[#ecba49] text-black rounded-lg font-semibold hover:brightness-110 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"><Package size={20} /> My Orders</button>
                </div>

                {/* Profile Image Section */}
                <div className={`text-center mb-8 transition-all duration-800 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                    <div className="relative inline-block group cursor-pointer" onClick={handleImageClick}>
                        <img src={profileData?.image || 'https://via.placeholder.com/150'} alt="Profile" className={`w-32 h-32 rounded-full border-4 border-[#ecba49] object-cover transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl ${imageUploadLoading ? 'opacity-50' : ''}`} />
                        {imageUploadLoading ? (
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>
                        ) : (
                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"><Settings className="text-white animate-spin-slow" size={24} /></div>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Click image to change</p>
                </div>

                {/* Profile Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <h2 className={`text-xl font-semibold mb-4 text-[#ecba49] transition-all duration-800 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>Basic Information</h2>
                        <EditableField label="Full Name" field="name" value={profileData?.name} icon={User} handleSave={handleSave} />
                        <EditableField label="Phone Number" field="phone" value={profileData?.phone} type="tel" icon={Phone} handleSave={handleSave} />
                        <EditableField label="Age" field="profile.age" value={profileData?.profile?.age} type="number" icon={Calendar} handleSave={handleSave} />
                        <EditableField label="Gender" field="profile.gender" value={profileData?.profile?.gender} type="select" icon={User} handleSave={handleSave} />
                        <EditableDOBField label="Date of Birth" field="profile.dateOfBirth" value={profileData?.profile?.dateOfBirth} icon={Calendar} handleSave={handleSave} />
                    </div>
                    <div className="space-y-4">
                        <h2 className={`text-xl font-semibold mb-4 text-[#ecba49] transition-all duration-800 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>Address & Details</h2>
                        <EditableField label="Address" field="profile.address" value={profileData?.profile?.address} icon={MapPin} handleSave={handleSave} />
                        <EditableField label="City" field="profile.city" value={profileData?.profile?.city} icon={MapPin} handleSave={handleSave} />
                        <EditableField label="State" field="profile.state" value={profileData?.profile?.state} icon={MapPin} handleSave={handleSave} />
                        <EditableField label="Zip Code" field="profile.zipCode" value={profileData?.profile?.zipCode} icon={MapPin} handleSave={handleSave} />
                        <EditableField label="Country" field="profile.country" value={profileData?.profile?.country} icon={MapPin} handleSave={handleSave} />
                    </div>
                </div>

                <div className={`mt-8 space-y-4 transition-all duration-800 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <h2 className="text-xl font-semibold mb-4 text-[#ecba49]">Additional Information</h2>
                    <EditableField label="Occupation" field="profile.occupation" value={profileData?.profile?.occupation} icon={Settings} handleSave={handleSave} />
                    <EditableField label="Bio" field="profile.bio" value={profileData?.profile?.bio} icon={User} handleSave={handleSave} />
                </div>
            </div>
            <style jsx>{`
                @keyframes scale-in {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
                .animate-spin-slow { animation: spin 3s linear infinite; }
            `}</style>
        </div>
    );
};

export default Profile;