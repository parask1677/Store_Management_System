import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, FileText, BarChart3, LogOut, Menu, X, ShoppingBag, Clock, ClipboardList } from 'lucide-react';
import { useData } from '../context/DataContext';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-accent-500/10 text-accent-400 border-l-4 border-accent-500' 
        : 'text-gray-400 hover:bg-dark-700 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const adminNavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/orders', label: 'Orders', icon: ClipboardList }, // New Admin Orders Link
    { path: '/products', label: 'Inventory', icon: Package },
    { path: '/billing', label: 'POS / Billing', icon: FileText },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const customerNavItems = [
    { path: '/shop', label: 'Shop Products', icon: ShoppingBag },
    { path: '/my-orders', label: 'My Orders', icon: Clock },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : customerNavItems;

  return (
    <div className="flex h-screen bg-dark-900 text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-800 border-r border-dark-700">
        <div className="p-6 flex items-center gap-2 border-b border-dark-700">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user?.role === 'admin' ? 'bg-accent-500' : 'bg-emerald-500'}`}>
             <span className="font-bold text-white text-lg">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Nexus Store</h1>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              {user?.role} Panel
            </span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700">
          <div className="mb-4 px-4">
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="font-medium text-white truncate">{user?.name}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user?.role === 'admin' ? 'bg-accent-500' : 'bg-emerald-500'}`}>
             <span className="font-bold text-white text-lg">N</span>
          </div>
          <span className="font-bold text-lg">Nexus</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-dark-900/95 pt-20 p-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
             <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 mt-8 text-red-400 border border-red-900/30 rounded-lg"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0 relative bg-dark-900">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};