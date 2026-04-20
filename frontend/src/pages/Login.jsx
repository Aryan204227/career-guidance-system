import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiSun, FiMoon, FiAlertCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();

  const validate = () => {
    let temp = {};
    if (!formData.email) temp.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) temp.email = 'Enter a valid email address';
    if (!formData.password) temp.password = 'Password is required';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const tid = toast.loading('Signing in...');
    try {
      const { data } = await API.post('/auth/login', {
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      login(data);
      toast.success(`Welcome back, ${data.name}!`, { id: tid });
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.', { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#030014]' : 'bg-slate-50'}`}>
      <Toaster position="top-center" toastOptions={{ style: { background: isDark ? '#1e1e2f' : '#fff', color: isDark ? '#fff' : '#1e1e2f', borderRadius: '12px' } }} />

      {/* Theme Toggle */}
      <button onClick={toggleTheme}
        className={`absolute top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${isDark ? 'bg-white/5 border-white/10 text-yellow-300' : 'bg-black/5 border-black/10 text-slate-700'}`}
        aria-label="Toggle Theme">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={isDark ? 'dark' : 'light'} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Animated BG blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 80, 0], y: [0, -80, 0], scale: [1, 1.2, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-50 ${isDark ? 'bg-indigo-600' : 'bg-indigo-200'}`} />
        <motion.div animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.4, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-40 ${isDark ? 'bg-violet-700' : 'bg-violet-200'}`} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] z-10 px-5">
        <div className={`relative p-8 sm:p-10 rounded-[2rem] backdrop-blur-2xl border overflow-hidden ${isDark ? 'bg-white/[0.03] border-white/[0.08] shadow-[0_8px_40px_0_rgba(0,0,0,0.6)]' : 'bg-white/80 border-white/60 shadow-[0_8px_40px_0_rgba(100,100,111,0.15)]'}`}>

          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 shadow-xl ${isDark ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-600' : 'bg-gradient-to-tr from-violet-500 to-fuchsia-500'}`}>
              <FiLock className="text-white text-2xl" />
            </motion.div>
            <h2 className={`text-3xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome Back</h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sign in to your career dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
              <div className="relative group">
                <FiMail size={17} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : isDark ? 'text-slate-500 group-focus-within:text-fuchsia-400' : 'text-slate-400 group-focus-within:text-fuchsia-600'}`} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all border ${isDark ? 'bg-black/30 text-white placeholder-slate-600 border-white/5 focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10' : 'bg-white text-slate-900 placeholder-slate-400 border-slate-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-100'} ${errors.email ? 'border-red-400/60' : ''}`} />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center text-red-400 text-xs ml-1 gap-1">
                    <FiAlertCircle size={12} /> {errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
              <div className="relative group">
                <FiLock size={17} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : isDark ? 'text-slate-500 group-focus-within:text-fuchsia-400' : 'text-slate-400 group-focus-within:text-fuchsia-600'}`} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3.5 rounded-xl text-sm font-medium outline-none transition-all border ${isDark ? 'bg-black/30 text-white placeholder-slate-600 border-white/5 focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10' : 'bg-white text-slate-900 placeholder-slate-400 border-slate-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-100'} ${errors.password ? 'border-red-400/60' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-fuchsia-400' : 'text-slate-400 hover:text-fuchsia-600'}`}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center text-red-400 text-xs ml-1 gap-1">
                    <FiAlertCircle size={12} /> {errors.password}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className={`w-full py-4 mt-2 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${loading ? 'bg-fuchsia-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-[0_10px_20px_-10px_rgba(217,70,239,0.5)]'}`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><FiArrowRight /></>}
            </motion.button>
          </form>

          {/* Footer */}
          <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Don't have an account?{' '}
            <Link to="/signup" className={`font-bold transition-colors ${isDark ? 'text-fuchsia-400 hover:text-fuchsia-300' : 'text-fuchsia-600 hover:text-fuchsia-700'}`}>
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
