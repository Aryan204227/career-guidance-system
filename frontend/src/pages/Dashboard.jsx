import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowRight, FiZap, FiAward, FiRefreshCw } from 'react-icons/fi';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';

// ─── Professional PDF Generator ──────────────────────────────────────────────
const generatePDF = async (user, result) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  let y = 0;

  // ── Header Banner ─────────────────────────────────────────────────────────
  doc.setFillColor(15, 17, 21);
  doc.rect(0, 0, W, 40, 'F');
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('AI Career Intelligence Report', W / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text('Powered by CareerSystem — aptitude-driven career matching', W / 2, 28, { align: 'center' });
  y = 52;

  // ── Student Info ──────────────────────────────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('Student Profile', 15, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Name:`, 15, y);
  doc.setFont('helvetica', 'bold');
  doc.text(user.name || 'N/A', 40, y); y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Email:  ${user.email || 'N/A'}`, 15, y); y += 6;
  doc.text(`Date Generated: ${new Date().toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })}`, 15, y); y += 12;

  // ── Divider ───────────────────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, W - 15, y); y += 10;

  // ── Aptitude Scores ───────────────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('Aptitude Assessment Results', 15, y); y += 8;

  const { Logical = 0, Analytical = 0, Verbal = 0, Technical = 0 } = result.scores || {};
  const cats = [
    { label: 'Logical Reasoning',   score: Logical,    pct: Math.round((Logical / 3) * 100) },
    { label: 'Analytical Thinking', score: Analytical, pct: Math.round((Analytical / 3) * 100) },
    { label: 'Verbal Ability',      score: Verbal,     pct: Math.round((Verbal / 3) * 100) },
    { label: 'Technical Aptitude',  score: Technical,  pct: Math.round((Technical / 3) * 100) },
  ];

  cats.forEach(c => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`${c.label}`, 15, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(`${c.score}/3  (${c.pct}%)`, 100, y);
    // Mini progress bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(130, y - 4, 60, 5, 1, 1, 'F');
    const barFill = (c.pct / 100) * 60;
    doc.setFillColor(15, 17, 21);
    if (barFill > 0) doc.roundedRect(130, y - 4, barFill, 5, 1, 1, 'F');
    y += 9;
  });

  y += 6;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, W - 15, y); y += 10;

  // ── Strength & Weakness ────────────────────────────────────────────────────
  const sorted = [...cats].sort((a, b) => b.pct - a.pct);
  const strength = sorted[0]?.label || 'N/A';
  const weakness = sorted[sorted.length - 1]?.label || 'N/A';

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('Profile Analysis', 15, y); y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 130, 50);
  doc.text(`✓  Primary Strength:       ${strength}`, 15, y); y += 7;
  doc.setTextColor(200, 50, 50);
  doc.text(`!  Area for Improvement:   ${weakness}`, 15, y); y += 12;

  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, W - 15, y); y += 10;

  // ── Top 3 Career Matches ──────────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('Top 3 Recommended Career Pathways', 15, y); y += 8;

  const matches = (result.matches || []).slice(0, 3);
  matches.forEach((match, idx) => {
    // Card BG
    doc.setFillColor(248, 248, 250);
    doc.roundedRect(15, y - 5, W - 30, 36, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text(`${idx + 1}. ${match.career}`, 20, y + 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 17, 21);
    doc.text(`${match.matchPercentage}%`, W - 30, y + 3, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    const lines = doc.splitTextToSize(match.reasoning || '', W - 40);
    doc.text(lines.slice(0, 2), 20, y + 11);
    y += 42;
  });

  y += 5;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, W - 15, y); y += 8;

  // ── Footer ─────────────────────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text('This report was auto-generated by the AI Career Guidance System. Results are based on aptitude test performance.', W / 2, y, { align: 'center' });

  doc.save(`${(user.name || 'Student').replace(/ /g, '_')}_Career_Report.pdf`);
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    // If auth is loaded and no user, redirect to login
    if (!user) {
      const profile = localStorage.getItem('profile');
      if (!profile) {
        navigate('/login');
      }
      return;
    }

    let isMounted = true;
    if (state?.newResult) {
      setLatestResult(state.newResult);
      setLoading(false);
    } else {
      API.get('/tests/history')
        .then(({ data }) => { if (isMounted && data?.length > 0) setLatestResult(data[0]); })
        .catch(() => { if (isMounted) toast.error('Failed to load assessment data.'); })
        .finally(() => { if (isMounted) setLoading(false); });
    }
    return () => { isMounted = false; };
  }, [user, state, navigate]);

  const handleDownloadPDF = async () => {
    if (!user || !latestResult) return;
    setPdfLoading(true);
    try {
      await generatePDF(user, latestResult);
      toast.success('PDF Report downloaded!');
    } catch (e) {
      toast.error('Failed to generate PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading || !user) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f1115]' : 'bg-white'}`}>
      <div className="w-8 h-8 border-2 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin" />
    </div>
  );

  if (!latestResult) return (
    <div className={`min-h-screen pt-24 px-4 flex flex-col items-center justify-center font-sans ${isDark ? 'bg-[#0f1115] text-white' : 'bg-white text-gray-900'}`}>
      <FiZap className="text-5xl mb-6 text-yellow-500" />
      <h2 className="text-2xl font-bold mb-3">No Assessment Yet</h2>
      <p className={`mb-8 text-center max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Take the aptitude test to generate your personalised career dashboard.
      </p>
      <button onClick={() => navigate('/test')} className={`px-6 py-3 rounded-xl font-semibold transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
        Start Assessment
      </button>
    </div>
  );

  // Build radar chart data (percentage per category)
  const { Logical = 0, Analytical = 0, Verbal = 0, Technical = 0 } = latestResult.scores || {};
  const radarData = [
    { subject: 'Logical',    score: Math.round((Logical / 3) * 100) },
    { subject: 'Analytical', score: Math.round((Analytical / 3) * 100) },
    { subject: 'Verbal',     score: Math.round((Verbal / 3) * 100) },
    { subject: 'Technical',  score: Math.round((Technical / 3) * 100) },
  ];

  const topMatches = (latestResult.matches || []).slice(0, 3);

  // Strength & Weakness
  const sorted = [...radarData].sort((a, b) => b.score - a.score);
  const strength = sorted[0];
  const weakness = sorted[sorted.length - 1];

  const rankColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
  const rankLabels = ['Gold', 'Silver', 'Bronze'];

  return (
    <div className={`min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-16 font-sans transition-colors duration-300 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {user.name?.split(' ')[0]} 👋
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Assessment computed on {new Date(latestResult.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/test')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
            >
              <FiRefreshCw size={14} /> Retake Test
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} disabled:opacity-50`}
            >
              <FiDownload size={14} /> {pdfLoading ? 'Generating...' : 'Download Report'}
            </button>
          </div>
        </div>

        {/* ── Score Summary Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {radarData.map(d => (
            <motion.div key={d.subject} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border text-center ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
              <div className="text-2xl font-bold">{d.score}%</div>
              <div className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{d.subject}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Main Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Career Matches (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <FiAward /> Top 3 Career Alignments
            </h2>
            {topMatches.map((match, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                className={`p-6 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'} transition-all flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm font-bold ${rankColors[idx]}`}>#{idx + 1} {rankLabels[idx]}</span>
                    <h3 className="text-lg font-bold truncate">{match.career}</h3>
                  </div>
                  {/* Match Bar */}
                  <div className={`w-full h-1.5 rounded-full mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${match.matchPercentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}
                    />
                  </div>
                  <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{match.reasoning}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center gap-3 shrink-0">
                  <div className="text-center">
                    <span className="block text-3xl font-black">{match.matchPercentage}%</span>
                    <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Match</span>
                  </div>
                  <button
                    onClick={() => {
                      const target = match.careerId || match.career;
                      navigate(`/career/${target}`);
                    }}
                    className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                  >
                    <FiArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Radar + Strength/Weakness */}
          <div className="space-y-6">
            {/* Radar Chart */}
            <h2 className="text-lg font-semibold tracking-tight">Aptitude Radar</h2>
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }}
                    />
                    <Tooltip
                      formatter={(v) => [`${v}%`, 'Score']}
                      contentStyle={{ backgroundColor: isDark ? '#111827' : '#ffffff', borderColor: isDark ? '#374151' : '#e5e7eb', borderRadius: '8px' }}
                    />
                    <Radar dataKey="score" stroke={isDark ? '#e5e7eb' : '#111827'} fill={isDark ? '#e5e7eb' : '#111827'} fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strength / Weakness Cards */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm space-y-3`}>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Primary Strength</p>
                <p className="text-sm font-semibold">{strength?.subject} — {strength?.score}%</p>
              </div>
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>Area to Improve</p>
                <p className="text-sm font-semibold">{weakness?.subject} — {weakness?.score}%</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
