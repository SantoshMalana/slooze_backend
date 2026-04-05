const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response.utils');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, 201, 'User registered successfully.', result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, 200, 'Login successful.', result);
    } catch (error) {
      next(error);
    }
  }

  async me(req, res) {
    return successResponse(res, 200, 'Authenticated user fetched.', { user: req.user });
  }
}

module.exports = new AuthController();
