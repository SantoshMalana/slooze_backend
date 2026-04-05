const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

router.post('/register', registerValidator, authController.register.bind(authController));
router.post('/login', loginValidator, authController.login.bind(authController));
router.get('/me', authenticate, authController.me.bind(authController));

module.exports = router;
