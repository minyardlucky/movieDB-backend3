const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me', authenticateToken, userController.getMe);

module.exports = router;
