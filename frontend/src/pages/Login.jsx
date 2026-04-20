import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiSun, FiMoon, FiAlertCircle } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  // Google Login — uses access token flow to get user info, then sends to backend
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      const tid = toast.loading('Verifying with Google...');
      try {
        // Get user info from Google
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const userInfo = await userInfoRes.json();
        // Create/login via backend using email + name (server creates account if new)
        const { data } = await API.post('/auth/google-access', {
          name: userInfo.name,
          email: userInfo.email.toLowerCase(),
          googleId: userInfo.sub,
        });
        login(data);
        toast.success(`Welcome, ${data.name}!`, { id: tid });
        setTimeout(() => navigate('/dashboard'), 600);
      } catch (err) {
        toast.error('Google login failed. Please try again.', { id: tid });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error('Google login was cancelled.'),
  });

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

          {/* Google Button */}
          <button
            onClick={() => googleLogin()}
            disabled={googleLoading || loading}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-semibold mb-5 transition-all ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'} disabled:opacity-50`}
          >
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {googleLoading ? 'Verifying...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>or sign in with email</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
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
              type="submit" disabled={loading || googleLoading}
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
