const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, accountController.getAccounts);
router.post('/create', authMiddleware, accountController.createAccount);

module.exports = router;