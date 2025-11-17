const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ msg: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.getUserById(payload.id);
    if (!user) return res.status(401).json({ msg: 'User not found' });
    // normalize id property name to match frontend expectations
    req.user = { id: user.id, username: user.username, email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};