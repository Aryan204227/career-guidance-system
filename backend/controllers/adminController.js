const User = require('../models/User');
const Result = require('../models/Result');
const careerController = require('./careerController'); // To get career count
const fs = require('fs');

exports.getAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const testCount = await Result.countDocuments();
    
    // Get all careers
    const careers = Object.keys(require('./careerController').__proto__ || {}).length || 20; // Fallback estimate if require fails to parse

    // Get real users with their test counts
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'results', // Assuming the collection name is 'results'
          localField: '_id',
          foreignField: 'user',
          as: 'tests'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          testsTaken: { $size: '$tests' }
        }
      },
      { $sort: { testsTaken: -1 } },
      { $limit: 50 } // Get top 50 users
    ]);

    res.json({
      stats: {
        users: userCount,
        tests: testCount,
        careers: 22 // hardcoded real number from careerDatabase
      },
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching admin stats' });
  }
};
