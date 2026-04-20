import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { FiArrowRight, FiLogOut, FiUser, FiCompass, FiSun, FiMoon, FiZap, FiBarChart2, FiAward, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import AIChatbot from './components/AIChatbot';

// ─── Lazy pages ────────────────────────────────────────────────────────────────
const Login        = React.lazy(() => import('./pages/Login'));
const Signup       = React.lazy(() => import('./pages/Signup'));
const Test         = React.lazy(() => import('./pages/Test'));
const Dashboard    = React.lazy(() => import('./pages/Dashboard'));
const Explore      = React.lazy(() => import('./pages/Explore'));
const CareerDetails= React.lazy(() => import('./pages/CareerDetails'));
const Admin        = React.lazy(() => import('./pages/Admin'));

// ─── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = React.memo(() => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  // const profile = localStorage.getItem('profile'); // Removed: useAuth now provides user state
  // const user = profile ? JSON.parse(profile) : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 border-b transition-colors duration-300 ${isDark ? 'bg-[#0f1115]/90 border-gray-800 backdrop-blur-md' : 'bg-white/90 border-gray-200 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className={`text-lg font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>C</div>
            CareerSystem
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/explore" className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              <FiCompass size={15} /> Explore
            </Link>

            <button onClick={toggleTheme} title="Toggle Theme"
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg border transition-colors ${isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}`}>
                  <FiUser size={14} /> <span className="hidden sm:inline">{(user.name || 'User').split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} title="Logout"
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                  <FiLogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-3 py-1.5 text-sm font-semibold transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Log in
                </Link>
                <Link to="/signup" className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

// ─── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => {
  const { isDark } = useTheme();
  return (
    <footer className={`border-t py-12 transition-colors duration-300 ${isDark ? 'bg-[#0f1115] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className={`text-xl font-black tracking-tight flex items-center gap-2 mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>C</div>
              CareerSystem
            </Link>
            <p className="max-w-md text-sm leading-relaxed mb-6">
              Our AI-driven platform helps Indian students discover their true potential through scientific aptitude analysis and real-world industry data. Find your path today.
            </p>
            <div className="flex gap-4">
              {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                <a key={i} href="#" className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-gray-800 hover:bg-gray-800 hover:text-white' : 'border-gray-200 hover:bg-gray-100 hover:text-black'}`}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/explore" className="hover:text-blue-500 transition-colors">Career Directory</Link></li>
              <li><Link to="/test" className="hover:text-blue-500 transition-colors">Aptitude Test</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className={`pt-8 border-t text-xs text-center font-medium ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          © {new Date().getFullYear()} AI Career Counselling and Aptitude Analysis System. Built for Indian Students.
        </div>
      </div>
    </footer>
  );
};

// ─── Feature cards data ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <FiZap size={22} />,
    title: 'Aptitude-Based Matching',
    desc: 'A 12-question test across Logical, Analytical, Verbal, and Technical domains. Results are computed using weighted career vectors — not guesses.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: <FiBarChart2 size={22} />,
    title: 'Real India Data',
    desc: '22 careers with actual Indian salary ranges (Fresher & Senior), entrance exams (JEE, CLAT, NEET), and step-by-step roadmaps from Class 10.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: <FiAward size={22} />,
    title: 'Top 3 Career Report',
    desc: 'Your personalised PDF report includes category scores, strength/weakness analysis, and the top 3 career matches with full explanations.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

const STATS = [
  { value: '22+', label: 'Career Pathways' },
  { value: '4',   label: 'Aptitude Domains' },
  { value: '12',  label: 'Test Questions' },
  { value: '100%', label: 'India-Based Data' },
];

// ─── Hero ──────────────────────────────────────────────────────────────────────
const Hero = React.memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center pt-16 transition-colors duration-300 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-white text-gray-900'} overflow-hidden relative`}>

      {/* Background grid */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'opacity-[0.04]' : 'opacity-[0.03]'}`}
        style={{ backgroundImage: 'linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      {/* Soft gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-8">
          <span className={`px-4 py-1.5 text-xs font-bold rounded-full border ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
            🇮🇳 Designed for Indian Students • Class 10 to College
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
          Know your aptitude.<br />
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Find your career.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Take a 12-question aptitude test. Get matched to your top 3 careers using real weighted scoring — with roadmaps, entrance exams, and salary data for India.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Link to="/signup"
            className={`group px-7 py-3.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
            Start Free Assessment
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/explore"
            className={`px-7 py-3.5 text-sm font-semibold rounded-xl border transition-all ${isDark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
            Browse 22 Careers
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className={`flex flex-wrap justify-center gap-x-12 gap-y-6 pb-20 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black">{s.value}</div>
              <div className={`text-xs font-semibold uppercase tracking-wider mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 pb-16 text-left">
          {FEATURES.map((f, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.bg} ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{f.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className={`py-12 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className="text-2xl font-bold mb-3">Ready to find your path?</h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Free forever. No credit card required. Takes 10 minutes.
          </p>
          <Link to="/signup"
            className={`inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-xl transition-all ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
            Get Started — It's Free <FiArrowRight />
          </Link>
        </motion.div>

      </div>
    </div>
  );
});

// ─── Global loader ─────────────────────────────────────────────────────────────
const GlobalLoader = () => {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f1115]' : 'bg-white'}`}>
      <div className={`w-8 h-8 border-2 ${isDark ? 'border-gray-700 border-t-white' : 'border-gray-200 border-t-gray-900'} rounded-full animate-spin`} />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0f1115] text-white">
          <div className="text-red-500 mb-4"><FiZap size={48} /></div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong.</h2>
          <p className="text-gray-400 mb-6 max-w-md">The application encountered an unexpected error. Please refresh the page to try again.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition">
            Refresh Page
          </button>
          <pre className="mt-8 p-4 bg-black/50 rounded text-xs text-left text-red-400 max-w-2xl overflow-auto w-full">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen font-sans flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<GlobalLoader />}>
              <Routes>
                <Route path="/"           element={<Hero />} />
                <Route path="/login"      element={<Login />} />
                <Route path="/signup"     element={<Signup />} />
                <Route path="/test"       element={<Test />} />
                <Route path="/dashboard"  element={<Dashboard />} />
                <Route path="/explore"    element={<Explore />} />
                <Route path="/career/:id" element={<CareerDetails />} />
                <Route path="/admin"      element={<Admin />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <AIChatbot />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
