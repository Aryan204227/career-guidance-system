import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import API from '../api';

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    let isMounted = true;
    const fetchQuestions = async () => {
      try {
        const { data } = await API.get('/tests');
        if (data && data.length > 0) {
           const randomizedOptionsData = data.map(q => ({
             ...q,
             options: shuffleArray(q.options)
           }));
           if (isMounted) setQuestions(randomizedOptionsData);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) toast.error('Could not load the test.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchQuestions();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isLoading || isSubmitted) return;
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      toast('Time limit reached. Auto-submitting...');
      handleSubmit();
    }
  }, [timeLeft, isLoading, isSubmitted]);

  const handleOptionSelect = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading('Analyzing your answers...');
    try {
      setIsLoading(true);
      const res = await API.post('/tests', { answers });
      setTestResult(res.data);
      setIsSubmitted(true);
      
      // Save a snippet to localStorage for the AI Chatbot
      if (res.data && res.data.scores) {
        localStorage.setItem('lastAptitudeResult', JSON.stringify({
          scores: res.data.scores,
          topMatch: res.data.matches?.[0]?.career,
          timestamp: new Date().toISOString()
        }));
      }
      
      toast.success('Test Submitted Successfully!', { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error('Failed to compute results.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isSubmitted) {
    return (
      <div className={`min-h-screen pt-32 flex flex-col items-center justify-center transition-colors duration-300 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin"></div>
        <h2 className={`mt-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Initializing Assessment...</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className={`min-h-screen pt-32 text-center text-sm font-medium ${isDark ? 'bg-[#0f1115] text-red-400' : 'bg-[#fafafa] text-red-500'}`}>Assessment questions are currently unavailable.</div>;
  }

  if (isSubmitted && testResult) {
    return (
      <div className={`min-h-screen pt-24 px-4 pb-12 font-sans transition-colors duration-300 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
        <Toaster position="top-right" />
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-10 rounded-xl border text-center ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Assessment Complete</h2>
            <p className={`text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your cognitive profile has been successfully evaluated.</p>
            <button onClick={() => navigate('/dashboard', { state: { newResult: testResult } })} className={`px-6 py-3 rounded-md font-semibold text-sm transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
              View Performance Dashboard
            </button>
          </motion.div>

          <h3 className="text-xl font-semibold tracking-tight">Answer Review</h3>
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const isCorrect = answers[q._id] === q.correctAnswer;
              return (
                <div key={q._id} className={`p-6 rounded-xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {q.category} Module
                    </span>
                  </div>
                  <p className="text-base font-medium mb-6">{idx + 1}. {q.questionText}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={`text-xs font-semibold block mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Your Response</span>
                      <span className={`text-sm font-medium ${isCorrect ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                        {answers[q._id] || 'Omitted'}
                      </span>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={`text-xs font-semibold block mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Correct Response</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg text-sm leading-relaxed ${isDark ? 'bg-gray-800 border border-gray-700 text-gray-300' : 'bg-gray-100 border border-gray-200 text-gray-700'}`}>
                    <span className="font-semibold block mb-1">Explanation</span> 
                    {q.explanation || 'No explanation available.'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div className={`min-h-screen pt-24 px-4 pb-12 font-sans transition-colors duration-300 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Assessment</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Question {currentQ + 1} of {questions.length}</p>
          </div>
          <div className="text-right">
            <span className={`text-xl font-bold font-mono ${timeLeft < 60 ? 'text-red-500' : (isDark ? 'text-white' : 'text-black')}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            <span className={`block text-xs uppercase tracking-widest mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Remaining</span>
          </div>
        </div>

        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQ}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={`p-8 sm:p-10 rounded-xl border ${isDark ? 'bg-[#16181d] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}
          >
            <div className={`inline-block mb-6 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
              {q.category} Module
            </div>
            
            <h3 className="text-xl sm:text-2xl font-semibold mb-8 leading-relaxed">{q.questionText}</h3>
            
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isSelected = answers[q._id] === opt;
                return (
                  <button 
                    key={idx}
                    onClick={() => handleOptionSelect(q._id, opt)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected 
                        ? (isDark ? 'border-white bg-gray-800 text-white' : 'border-black bg-gray-50 text-black')
                        : (isDark ? 'border-gray-700 hover:border-gray-500 text-gray-300 hover:bg-gray-800' : 'border-gray-200 hover:border-gray-400 text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold border ${
                        isSelected 
                          ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                          : (isDark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-white border-gray-300 text-gray-500')
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span> 
                      <span className="text-sm font-medium">{opt}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button 
                onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                disabled={currentQ === 0}
                className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-30 ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
              >
                Previous
              </button>
              
              {currentQ === questions.length - 1 ? (
                <button 
                  onClick={handleSubmit} 
                  className={`px-8 py-2.5 rounded-md text-sm font-semibold transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  Complete Assessment
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))}
                  className={`px-8 py-2.5 rounded-md text-sm font-semibold transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Test;
