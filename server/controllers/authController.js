import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'haatlink-dev-secret-change-in-production';
const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() }
  );
};

const sendAuthResponse = (res, statusCode, user, message) => {
  const token = createToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(statusCode).json({
    message,
    user: {
      id: user._id,
      username: user.username,
      name: user.name || user.username,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

export const register = async (req, res) => {
  try {
    const { username, password, phone, name, role } = req.body;

    if (!username || !password || !phone) {
      return res.status(400).json({ message: 'Username, password, and phone number are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Check existing
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      if (existingUser.username === normalizedUsername) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
      return res.status(400).json({ message: 'Phone number is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
      phone: normalizedPhone,
      name: name?.trim() || normalizedUsername,
      role: role && ['farmer', 'buyer'].includes(role) ? role : 'farmer',
    });

    return sendAuthResponse(res, 201, newUser, 'Registration successful.');
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const fieldName = field === 'username' ? 'Username' : 'Phone number';
      return res.status(400).json({ message: `${fieldName} is already taken.` });
    }
    return res.status(500).json({ message: 'Error registering user.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier (username or phone) and password are required.' });
    }

    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { username: cleanIdentifier.toLowerCase() },
        { phone: cleanIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your username/phone and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your username/phone and password.' });
    }

    return sendAuthResponse(res, 200, user, 'Login successful.');
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in.', error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
  });
  return res.status(200).json({ message: 'Logged out successfully.' });
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name || user.username,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching profile.', error: error.message });
  }
};
