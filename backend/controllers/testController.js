const Question = require('../models/Question');
const Result = require('../models/Result');
const Career = require('../models/Career');

// ─── Dynamic AI reasoning based on user's dominant category ──────────────────
const generatePersonalizedReasoning = (careerTitle, normalizedScores) => {
  const dominant = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1])[0][0];
  const score    = Math.round(normalizedScores[dominant]);

  const intros = {
    Technical:  `You scored ${score}% in Technical skills! This means you are great at computers, coding, and building things.`,
    Logical:    `With a ${score}% in Logical thinking, you are awesome at solving puzzles, math, and making smart decisions.`,
    Analytical: `Your ${score}% Analytical score shows you have a detective's mind—you are great at analyzing data and finding facts.`,
    Verbal:     `Achieving ${score}% in Verbal skills means you have excellent communication, reading, and storytelling abilities.`,
  };

  return `${intros[dominant] || ''} Based on your unique aptitude profile, ${careerTitle} is an excellent match for you.`;
};

// ─── CONTROLLERS ─────────────────────────────────────────────────────────────

exports.getQuestions = async (req, res) => {
  try {
    // Fetch 3 balanced questions from each category (12 total, fully random)
    const [logical, analytical, verbal, technical] = await Promise.all([
      Question.aggregate([{ $match: { category: 'Logical' } },    { $sample: { size: 3 } }]),
      Question.aggregate([{ $match: { category: 'Analytical' } }, { $sample: { size: 3 } }]),
      Question.aggregate([{ $match: { category: 'Verbal' } },     { $sample: { size: 3 } }]),
      Question.aggregate([{ $match: { category: 'Technical' } },  { $sample: { size: 3 } }]),
    ]);

    // Shuffle the combined array
    const questions = [...logical, ...analytical, ...verbal, ...technical]
      .sort(() => Math.random() - 0.5);

    res.json(questions);
  } catch (error) {
    console.error('[getQuestions]', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Result.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('[getHistory]', error);
    res.status(500).json({ message: error.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Answers object is required.' });
    }

    // ── Step 1: Calculate raw and normalized category scores ────────────────
    let rawScores   = { Logical: 0, Analytical: 0, Verbal: 0, Technical: 0 };
    let totalPerCat = { Logical: 0, Analytical: 0, Verbal: 0, Technical: 0 };

    const questionIds = Object.keys(answers);
    const questions   = await Question.find({ _id: { $in: questionIds } });

    for (const q of questions) {
      if (!rawScores.hasOwnProperty(q.category)) continue;
      totalPerCat[q.category] += 1;
      if (q.correctAnswer === answers[q._id.toString()]) {
        rawScores[q.category] += 1;
      }
    }

    // Normalized scores: 0-100 per category (avoids NaN on empty categories)
    const normalizedScores = {
      Logical:    totalPerCat.Logical    ? (rawScores.Logical    / totalPerCat.Logical)    * 100 : 0,
      Analytical: totalPerCat.Analytical ? (rawScores.Analytical / totalPerCat.Analytical) * 100 : 0,
      Verbal:     totalPerCat.Verbal     ? (rawScores.Verbal     / totalPerCat.Verbal)     * 100 : 0,
      Technical:  totalPerCat.Technical  ? (rawScores.Technical  / totalPerCat.Technical)  * 100 : 0,
    };

    // ── Step 2: Fetch careers from database and score them ──────────────────
    const careers = await Career.find({});
    const allScored = careers.map(c => {
      const raw =
        normalizedScores.Logical    * (c.weights.Logical || 0)    +
        normalizedScores.Analytical * (c.weights.Analytical || 0) +
        normalizedScores.Verbal     * (c.weights.Verbal || 0)     +
        normalizedScores.Technical  * (c.weights.Technical || 0);

      // Strict Real Formula: Sum of (Normalized Score * Weight)
      const final = Math.round(raw);

      return {
        careerId:        c._id,
        career:          c.title,
        matchPercentage: final,
        reasoning:       generatePersonalizedReasoning(c.title, normalizedScores),
      };
    });

    // ── Step 3: Sort descending, take top 3 ─────────────────────────────────
    allScored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topMatches        = allScored.slice(0, 3);
    const recommendedCareers = topMatches.map(m => m.career);

    // ── Step 4: Persist ──────────────────────────────────────────────────────
    const result = await Result.create({
      user:             req.user._id,
      answers:          answers || {},
      scores:           rawScores,
      recommendedCareers,
      matches:          topMatches,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('[submitTest]', error);
    res.status(500).json({ message: error.message });
  }
};
