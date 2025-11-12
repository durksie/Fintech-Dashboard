const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/analytics', authMiddleware, transactionController.getAnalytics);
router.get('/:account_id', authMiddleware, transactionController.getTransactions);
router.post('/deposit', authMiddleware, transactionController.deposit);

module.exports = router;