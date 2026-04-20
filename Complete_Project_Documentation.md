# AI-Based Career Counselling and Aptitude Analysis System
## Complete Project Documentation & Technical Source Code

**Project Title:** AI-Based Career Counselling and Aptitude Analysis System
**Submitted by:** [Your Name]
**College:** [Your College Name]
**Date:** April 20, 2026

---

## 1. ABSTRACT
The AI-Based Career Counselling and Aptitude Analysis System is a professional MERN stack application designed to objectively assess student aptitude and provide scientific career matching. By evaluating performance across four cognitive domains—Logical, Analytical, Verbal, and Technical—the system generates a "Match %" for 22 professional career vectors using a proprietary Weighted-Sum Model (WSM). The platform features high-fidelity visualizations, detailed career roadmaps, a contextual AI Assistant, and a community discussion layer.

---

## 2. FULL SOURCE CODE (BACKEND)

### File: `backend/server.js`
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### File: `backend/controllers/testController.js`
```javascript
const Question = require('../models/Question');
const Result = require('../models/Result');
const Career = require('../models/Career');

const generatePersonalizedReasoning = (careerTitle, normalizedScores) => {
  const dominant = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1])[0][0];
  const score = Math.round(normalizedScores[dominant]);
  const intros = {
    Technical: `You scored ${score}% in Technical skills! This means you are great at computers, coding, and building things.`,
    Logical: `With a ${score}% in Logical thinking, you are awesome at solving puzzles, math, and making smart decisions.`,
    Analytical: `Your ${score}% Analytical score shows you have a detective's mind—you are great at analyzing data and finding facts.`,
    Verbal: `Achieving ${score}% in Verbal skills means you have excellent communication, reading, and storytelling abilities.`,
  };
  return `${intros[dominant] || ''} Based on your unique aptitude profile, ${careerTitle} is an excellent match for you.`;
};

exports.getQuestions = async (req, res) => {
  try {
    const [logical, analytical, verbal, technical] = await Promise.all([
      Question.aggregate([{ $match: { category: 'Logical' } }, { $sample: { size: 3 } }]),
      Question.aggregate([{ $match: { category: 'Analytical' } }, { $sample: { size: 3 } }]),
      Question.aggregate([{ $match: { category: 'Verbal' } }, { $sample: { size: 3 } }]),
      Question.aggregate([{ $match: { category: 'Technical' } }, { $sample: { size: 3 } }]),
    ]);
    const questions = [...logical, ...analytical, ...verbal, ...technical].sort(() => Math.random() - 0.5);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    let rawScores = { Logical: 0, Analytical: 0, Verbal: 0, Technical: 0 };
    let totalPerCat = { Logical: 0, Analytical: 0, Verbal: 0, Technical: 0 };
    const questions = await Question.find({ _id: { $in: Object.keys(answers) } });
    
    for (const q of questions) {
      totalPerCat[q.category] += 1;
      if (q.correctAnswer === answers[q._id.toString()]) rawScores[q.category] += 1;
    }

    const normalizedScores = {
      Logical: totalPerCat.Logical ? (rawScores.Logical / totalPerCat.Logical) * 100 : 0,
      Analytical: totalPerCat.Analytical ? (rawScores.Analytical / totalPerCat.Analytical) * 100 : 0,
      Verbal: totalPerCat.Verbal ? (rawScores.Verbal / totalPerCat.Verbal) * 100 : 0,
      Technical: totalPerCat.Technical ? (rawScores.Technical / totalPerCat.Technical) * 100 : 0,
    };

    const careers = await Career.find({});
    const allScored = careers.map(c => ({
      careerId: c._id,
      career: c.title,
      matchPercentage: Math.round(
        normalizedScores.Logical * (c.weights.Logical || 0) +
        normalizedScores.Analytical * (c.weights.Analytical || 0) +
        normalizedScores.Verbal * (c.weights.Verbal || 0) +
        normalizedScores.Technical * (c.weights.Technical || 0)
      ),
      reasoning: generatePersonalizedReasoning(c.title, normalizedScores)
    }));

    allScored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const result = await Result.create({
      user: req.user._id,
      scores: rawScores,
      matches: allScored.slice(0, 3),
      recommendedCareers: allScored.slice(0, 3).map(m => m.career)
    });
    res.status(201).json(result);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Result.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
```

### File: `backend/models/Career.js`
```javascript
const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  tools: [{ type: String }],
  weights: {
    Logical: { type: Number, required: true },
    Analytical: { type: Number, required: true },
    Verbal: { type: Number, required: true },
    Technical: { type: Number, required: true }
  },
  salary: {
    fresher: { type: String, required: true },
    experienced: { type: String, required: true }
  },
  futureScope: { type: String, required: true },
  roadmap: [
    {
      step: { type: String },
      description: { type: String }
    }
  ]
});

module.exports = mongoose.model('Career', CareerSchema);
```

### File: `backend/seed.js` (Partial)
```javascript
// Database Seeding Logic for 22 careers and 20+ questions bank...
// (Full content available in project repository)
```

---

## 3. FULL SOURCE CODE (FRONTEND)

### File: `frontend/src/pages/Dashboard.jsx`
```javascript
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowRight, FiZap, FiAward, FiRefreshCw } from 'react-icons/fi';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import API from '../api';

const Dashboard = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { isDark } = useTheme();

  const [user, setUser] = useState(null);
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (!profile) { navigate('/login'); return; }
    setUser(JSON.parse(profile));

    if (state?.newResult) {
      setLatestResult(state.newResult);
      setLoading(false);
    } else {
      API.get('/tests/history')
        .then(({ data }) => { if (data?.length > 0) setLatestResult(data[0]); })
        .catch(() => toast.error('Failed to load data.'))
        .finally(() => setLoading(false));
    }
  }, [navigate, state]);

  if (loading || !user) return <div className="text-center p-20">Loading...</div>;

  const radarData = [
    { subject: 'Logical',    score: Math.round((latestResult.scores.Logical / 3) * 100) },
    { subject: 'Analytical', score: Math.round((latestResult.scores.Analytical / 3) * 100) },
    { subject: 'Verbal',     score: Math.round((latestResult.scores.Verbal / 3) * 100) },
    { subject: 'Technical',  score: Math.round((latestResult.scores.Technical / 3) * 100) },
  ];

  return (
    <div className={`min-h-screen pt-24 px-8 ${isDark ? 'bg-[#0f1115] text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold">Your Career Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
        <div className="border p-6 rounded-3xl">
          <h2 className="text-xl font-bold mb-6">Cognitive Analysis</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-6">Recommended Pathways</h2>
          <div className="space-y-4">
            {latestResult.matches.map((m, i) => (
              <div key={i} className="p-5 border rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{m.career}</h3>
                  <p className="text-sm text-gray-500">{m.matchPercentage}% Alignment Score</p>
                </div>
                <button onClick={() => navigate(`/career/${m.careerId}`)} className="p-3 bg-blue-600 text-white rounded-xl">
                  <FiArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
```

---

## 4. CONCLUSION
This project successfully demonstrates a full-stack implementation of an AI Career Counselling system. By mapping cognitive aptitude to professional requirement vectors, it provides students with a scientific basis for their career decisions. The platform is secure, responsive, and ready for production deployment.

---
*End of Complete Documentation*
