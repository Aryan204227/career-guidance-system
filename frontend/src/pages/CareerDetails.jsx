import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiDollarSign, FiTrendingUp, FiCheckCircle, FiTool,
  FiAlertCircle, FiArrowLeft, FiFlag, FiChevronRight
} from 'react-icons/fi';
import CommentSection from '../components/CommentSection';
import { useTheme } from '../context/ThemeContext';
import API from '../api';

const careersCache = {};

const CareerDetails = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(careersCache[id] || null);
  const [loading, setLoading] = useState(!careersCache[id]);
  const [error, setError] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    if (careersCache[id]) {
      setCareer(careersCache[id]);
      setLoading(false);
      setError(false);
      return;
    }
    
    let isMounted = true;
    setLoading(true);
    API.get(`/careers/${id}`)
      .then(({ data }) => {
        if (isMounted) { 
          careersCache[id] = data;
          setCareer(data); 
          setError(false); 
        }
      })
      .catch(() => { if (isMounted) setError(true); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [id]);

  if (loading) return (
    <div className={`min-h-screen pt-32 flex flex-col items-center justify-center ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      <div className="w-8 h-8 border-2 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin" />
      <p className={`mt-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading career data...</p>
    </div>
  );

  if (error || !career) return (
    <div className={`min-h-screen pt-32 flex flex-col items-center justify-center ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      <FiAlertCircle className="text-4xl text-red-500 mb-4" />
      <h2 className="text-xl font-bold tracking-tight mb-2">Career Not Found</h2>
      <p className={`text-sm mb-8 max-w-md text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        We could not retrieve this career. Please return to the directory.
      </p>
      <Link to="/explore" className={`px-5 py-2.5 rounded-md font-semibold text-sm border transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-50 text-black'}`}>
        Back to Directory
      </Link>
    </div>
  );

  // career.salary is an object: { fresher, experienced }
  const salaryFresher = career.salary?.fresher || 'N/A';
  const salaryExp     = career.salary?.experienced || 'N/A';

  return (
    <div className={`min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-16 font-sans transition-colors duration-300 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">

        <Link to="/explore" className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
          <FiArrowLeft /> Back to Directory
        </Link>

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-8 sm:p-10 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{career.title}</h1>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{career.description}</p>
        </motion.div>

        {/* Salary & Future Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <FiDollarSign size={20} />
              </div>
              <h3 className="text-base font-semibold">Salary (India)</h3>
            </div>
            <div className="space-y-3">
              <div className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Fresher (0–2 yrs)</span>
                <span className="text-sm font-bold">{salaryFresher} / yr</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Experienced (5+ yrs)</span>
                <span className="text-sm font-bold">{salaryExp} / yr</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <FiTrendingUp size={20} />
              </div>
              <h3 className="text-base font-semibold">Future Scope</h3>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{career.futureScope}</p>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
            <h3 className="text-base font-semibold mb-4">Core Skills Required</h3>
            <ul className="space-y-2.5">
              {career.skills?.map((skill, i) => (
                <li key={i} className="flex items-center gap-3">
                  <FiCheckCircle className={`shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{skill}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tools */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
            <div className="flex items-center gap-3 mb-4">
              <FiTool className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              <h3 className="text-base font-semibold">Tools & Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {career.tools?.map((tool, i) => (
                <span key={i} className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Roadmap */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`p-8 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="flex items-center gap-3 mb-8">
            <FiFlag className={isDark ? 'text-amber-400' : 'text-amber-600'} size={20} />
            <h2 className="text-xl font-bold tracking-tight">Step-by-Step Career Roadmap</h2>
          </div>
          <div className="space-y-0">
            {career.roadmap?.map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}>
                    {i + 1}
                  </div>
                  {i < career.roadmap.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-6 flex-1 ${i < career.roadmap.length - 1 ? '' : ''}`}>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">{step.step}</h4>
                      <FiChevronRight className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CommentSection careerId={id} />
        </motion.div>

      </div>
    </div>
  );
};

export default CareerDetails;
