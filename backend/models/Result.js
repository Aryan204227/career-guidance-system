const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Object, default: {} },
  scores: {
    Logical:    { type: Number, default: 0 },
    Analytical: { type: Number, default: 0 },
    Verbal:     { type: Number, default: 0 },
    Technical:  { type: Number, default: 0 }
  },
  recommendedCareers: [{ type: String }],
  matches: [{
    careerId:        { type: String },
    career:          { type: String },
    matchPercentage: { type: Number },
    reasoning:       { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
