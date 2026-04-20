const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  category: { type: String, enum: ['Logical', 'Analytical', 'Verbal', 'Technical'], required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
});

module.exports = mongoose.model('Question', QuestionSchema);
