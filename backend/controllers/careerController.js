const Career = require('../models/Career');

exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find({});
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (career) {
      res.json(career);
    } else {
      res.status(404).json({ message: 'Career not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
