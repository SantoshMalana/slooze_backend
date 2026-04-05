const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth.utils');

class AuthService {
  async register(userData) {
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      const error = new Error('Email already registered.');
      error.statusCode = 409;
      throw error;
    }

    const hashed = await hashPassword(userData.password);
    const user = await userRepository.create({ ...userData, password: hashed });

    const token = generateToken({ id: user._id, role: user.role, country: user.country });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
      },
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({ id: user._id, role: user.role, country: user.country });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
      },
    };
  }
}

module.exports = new AuthService();
