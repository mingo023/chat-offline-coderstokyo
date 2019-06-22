const express = require('express');
const authControllers = require('../controllers/auth-controller');
const router = express.Router();

router.get('/register', authControllers.register);
router.post('/register', authControllers.postRegister);

router.get('/login', authControllers.login);
router.post('/login', authControllers.postLogin);

module.exports = router;
