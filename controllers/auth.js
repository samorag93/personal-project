const mongodb = require('../data/database');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    const user = await mongodb.getDatabase().db().collection('users').findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({"Security Code": token });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Login failed' });
  }
};

module.exports = { login };
