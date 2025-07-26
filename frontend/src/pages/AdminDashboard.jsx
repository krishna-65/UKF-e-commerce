import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Users, ShoppingBag, Package, TrendingUp, DollarSign, Eye, Star,
  Calendar, Filter, Download, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';
import { endpoints } from '../services/api';
import { apiConnector } from '../services/apiConnector';
import { toast } from 'react-hot-toast';

const {adminDashboard} = endpoints;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalItemsSold: 0,
    totalStock: 0,
    outOfStock: 0,
    topProducts: [],
    category: [],
    products: []
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await apiConnector("GET", adminDashboard);
      console.log('API Response:', response);

      if (response?.data?.success) { // Check for response.data.success
        const data = response.data.stats; // Access the data property from response
        
        // Map the API response to your stats structure
        const mappedStats = {
          totalUsers: data.totalUsers || 0,
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalItemsSold: data.totalItemsSold || 0,
          totalStock: data.totalStock || 0,
          outOfStock: data.outOfStock || 0,
          topProducts: data.topProducts || [],
          category: data.category || [], // Make sure this matches your backend response
          products: data.products || []
        };

        setStats(mappedStats);
        generateMonthlyData(mappedStats);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate monthly data from available stats
  const generateMonthlyData = (statsData) => {
    if (!statsData.products || !statsData.products.length) return [];

    const groupedData = {};
    const currentDate = new Date();

    // Initialize data structure based on selected period
    switch (selectedPeriod) {
      case 'daily':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setDate(date.getDate() - i);
          const key = date.toISOString().split('T')[0];
          groupedData[key] = {
            date: key,
            products: 0,
            revenue: 0,
            orders: 0
          };
        }
        break;

      case 'monthly':
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setMonth(date.getMonth() - i);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          groupedData[key] = {
            date: key,
            products: 0,
            revenue: 0,
            orders: 0
          };
        }
        break;

      case 'yearly':
        // Last 5 years
        for (let i = 4; i >= 0; i--) {
          const year = currentDate.getFullYear() - i;
          groupedData[year] = {
            date: year.toString(),
            products: 0,
            revenue: 0,
            orders: 0
          };
        }
        break;
    }

    // Group products by period
    statsData.products.forEach(product => {
      const createdAt = new Date(product.createdAt);
      let key;

      switch (selectedPeriod) {
        case 'daily':
          key = createdAt.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          key = createdAt.getFullYear().toString();
          break;
      }

      if (groupedData[key]) {
        groupedData[key].products++;
        groupedData[key].revenue += product.price || 0;
      }
    });

    // Convert to array and format for charts
    const formattedData = Object.values(groupedData).map(data => ({
      month: formatPeriodLabel(data.date),
      products: data.products,
      revenue: data.revenue,
      orders: Math.floor(data.products * 0.8) // Estimate orders as 80% of products
    }));

    setMonthlyData(formattedData);
  };

  // Helper function to format period labels
  const formatPeriodLabel = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    switch (selectedPeriod) {
      case 'daily':
        const [year, month, day] = date.split('-');
        return `${day}/${month}`;
      case 'monthly':
        const [y, m] = date.split('-');
        return `${months[parseInt(m) - 1]}`;
      case 'yearly':
        return date;
      default:
        return date;
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  useEffect(() => {
    if (stats.products?.length > 0) {
      generateMonthlyData(stats);
    }
  }, [stats.products, selectedPeriod]);

  // Log current stats for debugging
  useEffect(() => {
    console.log("Current stats:", stats);
  }, [stats]);

  // Process category data for pie chart
  const getCategoryData = () => {
    console.log("Category data:", stats.category);
    
    if (!stats.category || stats.category.length === 0) {
      console.log("No category data available");
      return [];
    }
    
    const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FFB347'];
    return stats.category.map((cat, index) => ({
      name: cat.name || 'Unknown Category',
      value: cat.count || 0, // Assuming your backend sends a count
      color: colors[index % colors.length]
    }));
  };

  // Process order status data
  const getOrderStatusData = () => {
    // This data should ideally come from an orders endpoint with status breakdown
    const total = stats.totalOrders;
    return [
      { status: 'Completed', count: Math.floor(total * 0.6), color: '#FFD700' },
      { status: 'Processing', count: Math.floor(total * 0.2), color: '#FFA500' },
      { status: 'Pending', count: Math.floor(total * 0.15), color: '#FF8C00' },
      { status: 'Cancelled', count: Math.floor(total * 0.05), color: '#FF6B6B' }
    ];
  };

  const StatCard = ({ title, value, icon: Icon, change, color = '#FFD700' }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 group-hover:from-yellow-400/30 group-hover:to-yellow-600/30 transition-all duration-300`}>
          <Icon className="w-6 h-6 text-yellow-400" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
          {value}
        </p>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-yellow-500 rounded-lg p-3 shadow-lg">
          <p className="text-yellow-400 font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white text-sm">
              {entry.name}: {entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="lg:w-[calc(100vw-256px)] p-6 text-white overflow-y-auto h-[100vh] bg-black">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-400">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-[calc(100vw-256px)] hidescroll p-6 text-white overflow-y-auto h-[100vh] bg-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your store.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
            >
              <option value="daily">Daily</option>
            
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            
            <button 
              onClick={() => {
                toast.loading("Refreshing dashboard...");
                fetchDashboardData();
              }}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} change={12} />
          <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} change={8} />
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue?.toLocaleString() || 0}`} icon={DollarSign} change={15} />
          <StatCard title="Products" value={stats.totalProducts} icon={Package} change={5} />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Items Sold" value={stats.totalItemsSold} icon={TrendingUp} change={10} />
          <StatCard title="Total Stock" value={stats.totalStock} icon={Package} change={-2} />
          <StatCard title="Out of Stock" value={stats.outOfStock} icon={Package} change={-5} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Performance */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedPeriod === 'daily' ? 'Daily' : 
                 selectedPeriod === 'monthly' ? 'Monthly' : 
                 'Yearly'} Performance
              </h3>
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#FFD700" fill="url(#revenueGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Category Distribution</h3>
              <Eye className="w-5 h-5 text-yellow-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">User Growth</h3>
              <Users className="w-5 h-5 text-yellow-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders vs Products */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Orders vs Products</h3>
              <BarChart className="w-5 h-5 text-yellow-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#FFD700" radius={[4, 4, 0, 0]} />
                <Bar dataKey="products" fill="#FFA500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Order Status</h3>
              <Package className="w-5 h-5 text-yellow-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={getOrderStatusData()}>
                <RadialBar dataKey="count" cornerRadius={10} fill={(entry) => entry.color} />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Selling Products</h3>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 text-yellow-400" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4 text-yellow-400" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-gray-400 font-medium">Product</th>
                  <th className="pb-3 text-gray-400 font-medium">Stock</th>
                  <th className="pb-3 text-gray-400 font-medium">Price</th>
                  <th className="pb-3 text-gray-400 font-medium">Category</th>
                  <th className="pb-3 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.products && stats.products.length > 0 ? (
                  stats.products.slice(0, 5).map((product) => (
                    <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-white font-medium">{product.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-300">{product.stock || 0}</td>
                      <td className="py-4 text-green-400">${(product.price || 0).toLocaleString()}</td>
                      <td className="py-4 text-gray-300">{product.category?.name || 'N/A'}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-400">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-yellow-400" />
              <div>
                <h4 className="text-lg font-semibold text-white">Manage Users</h4>
                <p className="text-gray-400 text-sm">View and manage user accounts</p>
              </div>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition-colors">
              View Users
            </button>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="w-8 h-8 text-yellow-400" />
              <div>
                <h4 className="text-lg font-semibold text-white">Inventory</h4>
                <p className="text-gray-400 text-sm">Manage products and stock</p>
              </div>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition-colors">
              Manage Inventory
            </button>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-yellow-400" />
              <div>
                <h4 className="text-lg font-semibold text-white">Orders</h4>
                <p className="text-gray-400 text-sm">Process and track orders</p>
              </div>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition-colors">
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;