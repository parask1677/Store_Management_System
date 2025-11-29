
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, Loader2, WifiOff } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456'); 
  const [role, setRole] = useState<'admin' | 'customer'>('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useData();

  // Pre-fill for demo purposes
  React.useEffect(() => {
    if (role === 'admin') {
      setEmail('admin@nexus.com');
    } else {
      setEmail('nitin@example.com');
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = await login(email, role);
    
    if (success) {
      if (role === 'admin') navigate('/');
      else navigate('/shop');
    } else {
      setError('Login failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
           className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl transition-colors duration-500 ${role === 'admin' ? 'bg-accent-600/20' : 'bg-emerald-600/20'}`}
         />
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
           className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl transition-colors duration-500 ${role === 'admin' ? 'bg-purple-600/20' : 'bg-teal-600/20'}`}
         />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-dark-800/80 backdrop-blur-xl border border-dark-700 rounded-2xl shadow-2xl p-8"
      >
        
        {/* Demo Mode Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-medium text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
          <WifiOff size={12} />
          <span>Demo Mode</span>
        </div>

        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-colors duration-300 ${role === 'admin' ? 'bg-accent-600 shadow-accent-600/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}
          >
            <span className="text-3xl font-bold text-white">N</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Role Toggles */}
        <div className="flex bg-dark-900/50 p-1 rounded-lg mb-6 border border-dark-700">
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              role === 'admin' ? 'bg-dark-700 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
          <button 
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              role === 'customer' ? 'bg-dark-700 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <User size={16} /> Customer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center overflow-hidden"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                className="w-full bg-dark-900/50 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-accent-500 focus:outline-none transition-colors"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                className="w-full bg-dark-900/50 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-accent-500 focus:outline-none transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
               <p className="text-xs text-gray-500">Demo Password: 123456</p>
               <p className="text-xs text-gray-500">Try: dev, nitin or akash (@example.com)</p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-3 rounded-lg shadow-lg transition-all text-white flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-accent-600 hover:bg-accent-500 shadow-accent-600/25' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'}`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : `Sign In as ${role === 'admin' ? 'Admin' : 'Customer'}`}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Running in Offline Demo Mode
        </div>
      </motion.div>
    </div>
  );
};
