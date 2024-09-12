const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const config = require('../config/config');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
    const refreshToken = jwt.sign({ id: user._id }, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRATION });

    // Save refresh token
    await RefreshToken.create({ token: refreshToken, user: user._id });

    res.json({ accessToken, refreshToken });
};
