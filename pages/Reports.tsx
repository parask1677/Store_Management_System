import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const { invoices, products } = useData();

  // Aggregate revenue by date
  const revenueByDate = invoices.reduce((acc: any, inv) => {
    const date = new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + inv.total;
    return acc;
  }, {});

  const lineData = Object.keys(revenueByDate).map(date => ({
    name: date,
    revenue: revenueByDate[date]
  }));

  // Sales by Category
  const categorySales = invoices.flatMap(inv => inv.items).reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.price * item.quantity);
    return acc;
  }, {});

  const pieData = Object.keys(categorySales).map(cat => ({
    name: cat,
    value: categorySales[cat]
  }));

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Sales Reports</h2>
          <p className="text-gray-400">Analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-gray-300">
          <Calendar size={18} />
          <span className="text-sm">Last 30 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData.length ? lineData : [{name: 'Today', revenue: 0}]}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                   itemStyle={{ color: '#818cf8' }}
                   formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Sales by Category</h3>
          <div className="h-72 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500">No sales data available yet.</div>
            )}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark-900/50 text-gray-400 text-sm">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {invoices.slice(0, 5).map(invoice => (
                <tr key={invoice.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4 text-accent-400 font-medium">{invoice.id}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-white">{invoice.customerName}</td>
                  <td className="px-6 py-4 text-gray-400">{invoice.items.length} items</td>
                  <td className="px-6 py-4 text-right font-bold text-white">₹{invoice.total.toFixed(2)}</td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No transactions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};