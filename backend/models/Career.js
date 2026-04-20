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
