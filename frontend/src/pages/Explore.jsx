import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import API from '../api';

const domainColors = {
  Technical:     { badge: 'bg-blue-100 text-blue-700',    badgeDark: 'bg-blue-500/10 text-blue-400' },
  Business:      { badge: 'bg-emerald-100 text-emerald-700', badgeDark: 'bg-emerald-500/10 text-emerald-400' },
  Creative:      { badge: 'bg-purple-100 text-purple-700', badgeDark: 'bg-purple-500/10 text-purple-400' },
  Communication: { badge: 'bg-amber-100 text-amber-700',  badgeDark: 'bg-amber-500/10 text-amber-400' },
  Research:      { badge: 'bg-rose-100 text-rose-700',    badgeDark: 'bg-rose-500/10 text-rose-400' },
};

// Map career title → domain
const domainMap = {
  'Software Engineer': 'Technical', 'AI / ML Engineer': 'Technical', 'Cybersecurity Analyst': 'Technical',
  'Data Scientist': 'Technical', 'Web Developer': 'Technical', 'Cloud / DevOps Engineer': 'Technical',
  'Business Analyst': 'Business', 'Financial Analyst': 'Business', 'Product Manager': 'Business',
  'Management Consultant': 'Business', 'Entrepreneur / Startup Founder': 'Business',
  'UI/UX Designer': 'Creative', 'Graphic Designer': 'Creative', 'Content Strategist': 'Creative',
  'Video Editor / Filmmaker': 'Creative',
  'Lawyer / Advocate': 'Communication', 'Journalist / Author': 'Communication',
  'Human Resources Manager': 'Communication', 'Marketing Manager': 'Communication',
  'Research Scientist': 'Research', 'Psychologist / Counselor': 'Research', 'Civil Services / IAS Officer': 'Research',
};

const domainOrder = ['Technical', 'Business', 'Creative', 'Communication', 'Research'];

let careerCache = null;

const Explore = () => {
  const { isDark } = useTheme();
  const [careers, setCareers] = useState(careerCache || []);
  const [loading, setLoading] = useState(!careerCache);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (careerCache) {
      setCareers(careerCache);
      setLoading(false);
      return;
    }
    API.get('/careers')
      .then(({ data }) => {
        careerCache = data;
        setCareers(data);
      })
      .catch(err => console.error('Failed to load careers:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = careers.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen pt-24 px-4 pb-16 font-sans transition-colors duration-300 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Career Directory</h1>
          <p className={`max-w-2xl mx-auto mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Browse 22 high-growth career paths with real India-based salary, tools, and step-by-step roadmaps.
          </p>
          {/* Search Bar */}
          <div className={`relative max-w-md mx-auto rounded-xl border flex items-center px-4 py-3 ${isDark ? 'bg-[#16181d] border-gray-700' : 'bg-white border-gray-200'}`}>
            <FiSearch className={`mr-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search careers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          domainOrder.map(domain => {
            const domainCareers = filtered.filter(c => domainMap[c.title] === domain);
            if (domainCareers.length === 0) return null;
            return (
              <div key={domain} className="mb-14">
                <div className={`border-b pb-3 mb-6 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <h2 className="text-lg font-semibold uppercase tracking-wider">{domain} Sector</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {domainCareers.map((career, idx) => {
                    const color = domainColors[domain] || domainColors.Technical;
                    return (
                      <motion.div
                        key={career._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        whileHover={{ y: -3 }}
                        className={`p-6 rounded-xl border flex flex-col transition-all ${
                          isDark
                            ? 'bg-[#16181d] border-gray-800 hover:border-gray-600'
                            : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-md mb-4 ${isDark ? color.badgeDark : color.badge}`}>
                          {domain}
                        </span>
                        <h3 className="text-base font-bold mb-2">{career.title}</h3>
                        <p className={`text-sm flex-1 leading-relaxed line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {career.description}
                        </p>
                        <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-medium ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-500'}`}>
                          <span>Fresher: {career.salary?.fresher}</span>
                        </div>
                        <Link
                          to={`/career/${career._id}`}
                          className={`mt-4 flex items-center justify-between text-sm font-semibold transition-colors group ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                        >
                          <span>View Full Details</span>
                          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Explore;
