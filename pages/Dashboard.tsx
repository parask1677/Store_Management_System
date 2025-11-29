
import React from 'react';
import { useData } from '../context/DataContext';
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    variants={item}
    className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg hover:border-dark-600 transition-all"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {trend && (
          <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> {trend} from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { products, invoices, customers } = useData();

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStockThreshold);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  
  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400">Welcome back to Nexus Store Manager</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="text-emerald-400" 
          trend="+12.5%"
        />
        <StatCard 
          title="Total Invoices" 
          value={invoices.length} 
          icon={ShoppingCart} 
          color="text-blue-400" 
        />
        <StatCard 
          title="Total Products" 
          value={totalStock} 
          icon={Package} 
          color="text-purple-400" 
        />
        <StatCard 
          title="Total Customers" 
          value={customers.length} 
          icon={Users}
          color="text-orange-400" 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div variants={item} className="lg:col-span-2 bg-dark-800 p-6 rounded-xl border border-dark-700">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                />
                <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div variants={item} className="bg-dark-800 p-6 rounded-xl border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Low Stock Alerts</h3>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-medium">
              {lowStockProducts.length} Items
            </span>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Stock levels look good.</p>
            ) : (
              lowStockProducts.map(product => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg border border-dark-700/50 hover:border-red-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-md">
                       <AlertTriangle size={16} className="text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{product.name}</h4>
                      <p className="text-xs text-gray-500">SKU: {product.id.slice(0,6)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">{product.stock} left</p>
                    <p className="text-xs text-gray-500">Threshold: {product.minStockThreshold}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
