import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiMaximize2, FiBriefcase } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

// ─── Career knowledge base ────────────────────────────────────────────────────
const CAREER_KNOWLEDGE = {
  'software engineer':      { stream: 'PCM → B.Tech CSE', exams: 'JEE Main / JEE Advanced', salary: '₹6–25 LPA', skill: 'Technical & Logical' },
  'data scientist':         { stream: 'PCM / PCM+Math → B.Tech / B.Sc Statistics', exams: 'JEE / University entrance', salary: '₹7–30 LPA', skill: 'Analytical & Technical' },
  'ai ml engineer':         { stream: 'PCM → B.Tech CSE (AI)', exams: 'JEE Main / BITSAT', salary: '₹8–35 LPA', skill: 'Analytical & Technical' },
  'cybersecurity':          { stream: 'PCM → B.Tech CSE/IT', exams: 'JEE / State CET', salary: '₹5–20 LPA', skill: 'Technical & Logical' },
  'web developer':          { stream: 'Any → BCA / B.Tech / Bootcamp', exams: 'CUET / JEE', salary: '₹4–18 LPA', skill: 'Technical' },
  'doctor':                 { stream: 'PCB → MBBS', exams: 'NEET-UG', salary: '₹6–30 LPA', skill: 'Analytical & Verbal' },
  'lawyer':                 { stream: 'Humanities/Commerce → BA LLB', exams: 'CLAT / AILET', salary: '₹4–30 LPA', skill: 'Verbal & Logical' },
  'ias':                    { stream: 'Any → BA (History/Poly Sci)', exams: 'UPSC CSE', salary: '₹6.7–30 LPA', skill: 'Logical, Verbal & Analytical' },
  'civil services':         { stream: 'Any → BA', exams: 'UPSC CSE', salary: '₹6.7–30 LPA', skill: 'Logical, Verbal & Analytical' },
  'ca':                     { stream: 'Commerce → B.Com + CA Foundation', exams: 'ICAI CA Foundation', salary: '₹7–25 LPA', skill: 'Analytical & Logical' },
  'finance':                { stream: 'Commerce → B.Com / BBA (Finance)', exams: 'CUET / IPMAT', salary: '₹6–20 LPA', skill: 'Analytical & Logical' },
  'product manager':        { stream: 'Any → B.Tech / BBA + MBA', exams: 'JEE / CAT', salary: '₹10–35 LPA', skill: 'Balanced (All domains)' },
  'ui ux':                  { stream: 'Any → B.Des', exams: 'NID DAT / UCEED', salary: '₹5–20 LPA', skill: 'Analytical & Technical' },
  'graphic designer':       { stream: 'Arts → BFA / B.Des', exams: 'NID DAT / NIFT', salary: '₹3–12 LPA', skill: 'Creative & Analytical' },
  'journalist':             { stream: 'Humanities → BA Journalism', exams: 'IIMC / CUET', salary: '₹3–12 LPA', skill: 'Verbal & Analytical' },
  'psychologist':           { stream: 'Humanities/Science → BA/B.Sc Psychology', exams: 'CUET', salary: '₹3.5–15 LPA', skill: 'Verbal & Analytical' },
  'research scientist':     { stream: 'PCM/PCB → B.Sc → M.Sc → PhD', exams: 'NEST / IISER / IIT JAM', salary: '₹6–20 LPA', skill: 'Analytical & Logical' },
  'business analyst':       { stream: 'Commerce/Science → BBA / B.Tech + MBA', exams: 'CUET / CAT', salary: '₹5–15 LPA', skill: 'Analytical & Verbal' },
  'marketing manager':      { stream: 'Commerce → BBA + MBA Marketing', exams: 'CAT / XAT', salary: '₹7–30 LPA', skill: 'Verbal & Analytical' },
  'hr manager':             { stream: 'Commerce/Humanities → BBA + MBA HR', exams: 'XAT / TISSNET', salary: '₹6–25 LPA', skill: 'Verbal & Logical' },
  'entrepreneur':           { stream: 'Any stream', exams: 'No fixed path', salary: 'Variable (₹0 to crores)', skill: 'Balanced (All domains)' },
  'management consultant':  { stream: 'Any → Top college + MBA IIM', exams: 'CAT / GMAT', salary: '₹12–40 LPA', skill: 'Analytical & Verbal' },
  'cloud devops':           { stream: 'PCM → B.Tech CSE/IT', exams: 'JEE', salary: '₹7–28 LPA', skill: 'Technical & Analytical' },
};

// ─── Smart response engine ────────────────────────────────────────────────────
const buildResponse = (input, resultData) => {
  const lc = input.toLowerCase();
  const testScores = resultData?.scores;
  
  // Test score-aware greeting
  if (lc.match(/\b(hi|hello|hey|namaste)\b/)) {
    if (testScores) {
      const dom = Object.entries(testScores).sort((a,b) => b[1] - a[1])[0];
      return `Hello! Based on your latest assessment, your strongest aptitude is **${dom[0]}** (${dom[1]}/3). I can help you explore careers that match this strength like **${resultData.topMatch}**. What would you like to know?`;
    }
    return `Hello! I'm your AI Career Assistant. I can help you choose the right career based on your skills, stream, or aptitude. What would you like to explore?`;
  }

  // Salary queries
  if (lc.includes('salary') || lc.includes('package') || lc.includes('earn')) {
    return `💰 In India, career salaries vary by field:\n\n• Tech (Software/AI/Data): ₹6–35 LPA\n• Business/Consulting: ₹10–40 LPA\n• Creative (Design/Media): ₹3–15 LPA\n• Law/UPSC: ₹4–30 LPA\n• Research/Science: ₹6–20 LPA\n\nAfter taking the aptitude test, I can tell you the exact salary range for your top career matches!`;
  }

  // Aptitude test questions
  if (lc.includes('test') || lc.includes('aptitude') || lc.includes('assessment')) {
    return `📊 The Aptitude Test evaluates 4 dimensions:\n\n1. **Logical** — Sequences, relationships, puzzles\n2. **Analytical** — Numbers, data, problem-solving\n3. **Verbal** — Language, grammar, comprehension\n4. **Technical** — CS, DSA, databases\n\nEach section has 3 questions (12 total). Results are used to compute career match percentages using weighted scoring. Click "Start Evaluation" on the home page to begin!`;
  }

  // Stream / stream selection queries  
  if (lc.includes('stream') || lc.includes('class 11') || lc.includes('after 10th') || lc.includes('subject')) {
    return `📚 Choosing the right stream after Class 10:\n\n🔬 **Science (PCM)** → Engineering, Tech, Defence\n🧬 **Science (PCB)** → Medicine, Research, Biotechnology\n📊 **Commerce** → CA, Finance, Business, Law\n📖 **Humanities** → Civil Services, Law, Journalism, Psychology\n\nNot sure which stream suits you? Take our aptitude test — your scores will directly suggest the ideal stream!`;
  }

  // Career-specific queries — match against knowledge base
  for (const [key, info] of Object.entries(CAREER_KNOWLEDGE)) {
    if (lc.includes(key)) {
      return `🎯 **Career: ${key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}**\n\n📚 Stream: ${info.stream}\n📝 Entrance Exams: ${info.exams}\n💰 Salary (India): ${info.salary}\n🧠 Best Aptitude Fit: ${info.skill}\n\nWant to know the full roadmap, tools, or how to get started? Just ask!`;
    }
  }

  // Test result discussion
  if (testScores && (lc.includes('result') || lc.includes('score') || lc.includes('match'))) {
    const entries = Object.entries(testScores).sort((a,b) => b[1]-a[1]);
    const lines = entries.map(([k,v]) => `• ${k}: ${v}/3 (${Math.round((v/3)*100)}%)`).join('\n');
    return `📈 Your latest aptitude scores:\n\n${lines}\n\nBased on these scores, your top match is **${resultData.topMatch}**. Visit your Dashboard to see the full analysis and download your PDF report!`;
  }

  // JEE / NEET / entrance exam queries
  if (lc.includes('jee') || lc.includes('neet') || lc.includes('clat') || lc.includes('upsc') || lc.includes('entrance')) {
    return `📝 Major Indian Entrance Exams:\n\n• **JEE Main/Advanced** → IITs, NITs (Engineering)\n• **NEET-UG** → Medical colleges (MBBS, BDS)\n• **CLAT** → National Law Universities\n• **UPSC CSE** → IAS/IPS/IFS (Civil Services)\n• **CAT/XAT** → IIMs, Top B-Schools (MBA)\n• **NID DAT/UCEED** → Design institutes\n\nWhich exam are you preparing for? I can guide you further!`;
  }

  // General fallback
  return `I can help you with:\n\n• Career suggestions based on your aptitude\n• Stream selection after Class 10\n• Entrance exams & college options\n• Salary information for any career\n• Step-by-step roadmaps\n\nTry asking: "What career suits me if I like coding?" or "How to become a Data Scientist in India?"`;
};

// ─── Component ────────────────────────────────────────────────────────────────
const AIChatbot = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Get test scores from localStorage if available
  const getTestResult = () => {
    try {
      const saved = localStorage.getItem('lastAptitudeResult');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  };

  const [messages, setMessages] = useState([
    { text: "👋 Hi! I'm your AI Career Assistant.\n\nI can help you:\n• Explore careers that match your aptitude\n• Understand entrance exams\n• Plan your stream after Class 10\n\nWhat would you like to know?", isBot: true }
  ]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = buildResponse(userMsg, getTestResult());
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 700);
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const quickQuestions = [
    "What career suits me?",
    "How to become a Data Scientist?",
    "Which stream after Class 10?",
    "What is JEE exam?"
  ];

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} transition-all`}
          >
            <FiBriefcase size={22} />
            <span className="text-sm font-semibold pr-1 hidden sm:inline">Career AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`fixed right-4 sm:right-6 bottom-6 w-[calc(100vw-2rem)] sm:w-[400px] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border transition-all duration-300 ${
              isMinimized ? 'h-[60px]' : 'h-[540px] max-h-[85vh]'
            } ${isDark ? 'bg-[#0f1115] border-gray-800' : 'bg-white border-gray-200'}`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b flex justify-between items-center cursor-pointer shrink-0 ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-gray-50 border-gray-200'}`}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                  <FiBriefcase size={16} />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Career AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Always active</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={e => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}>
                  {isMinimized ? <FiMaximize2 size={15} /> : <FiMinimize2 size={15} />}
                </button>
                <button onClick={e => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-200'}`}>
                  <FiX size={17} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-[#0f1115]' : 'bg-gray-50'}`}>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.isBot
                          ? isDark
                            ? 'bg-[#16181d] border border-gray-800 text-gray-200 rounded-tl-sm'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                          : isDark
                            ? 'bg-white text-black rounded-tr-sm'
                            : 'bg-gray-900 text-white rounded-tr-sm'
                      }`}>
                        {formatMessage(msg.text)}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${isDark ? 'bg-[#16181d] border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i} className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`}
                              animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length <= 1 && (
                  <div className={`px-4 py-2 flex flex-wrap gap-2 border-t ${isDark ? 'border-gray-800 bg-[#0f1115]' : 'border-gray-200 bg-gray-50'}`}>
                    {quickQuestions.map((q, i) => (
                      <button key={i} onClick={() => { setInput(q); }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${isDark ? 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className={`p-3 border-t shrink-0 ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'}`}>
                  <div className={`flex items-center rounded-xl overflow-hidden border ${isDark ? 'bg-[#0f1115] border-gray-700 focus-within:border-gray-500' : 'bg-gray-50 border-gray-300 focus-within:border-gray-400'}`}>
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder="Ask me anything about careers..."
                      className={`flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none ${isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                    />
                    <button onClick={handleSend} disabled={!input.trim()}
                      className={`p-2 mr-2 rounded-lg transition-colors disabled:opacity-30 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                      <FiSend size={15} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
