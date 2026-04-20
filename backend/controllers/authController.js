const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email?.toLowerCase();
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'An account with this email already exists.' });

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase();
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email });
    if (user && user.password && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      // Create new user from Google
      const randomPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = await User.create({ name, email, googleId: sub, password: randomPass });
    } else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) {
    console.error('[googleLogin]', error.message);
    res.status(500).json({ message: 'Google authentication failed. Please try again.' });
  }
};

// Access-token based Google login (frontend fetches userinfo, sends name/email/googleId here)
exports.googleAccessLogin = async (req, res) => {
  const { name, googleId } = req.body;
  const email = req.body.email?.toLowerCase();
  try {
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    let user = await User.findOne({ email });
    if (!user) {
      const randomPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = await User.create({ name: name || email.split('@')[0], email, googleId, password: randomPass });
    } else if (!user.googleId && googleId) {
      user.googleId = googleId;
      await user.save();
    }
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) {
    console.error('[googleAccessLogin]', error.message);
    res.status(500).json({ message: 'Google login failed. Please try again.' });
  }
};
