const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');

const transactionController = {
  getTransactions: (req, res) => {
    const { account_id } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    Transaction.findByAccountId(account_id, limit, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }

      res.json({
        success: true,
        data: {
          transactions: results
        }
      });
    });
  },

  deposit: (req, res) => {
    const { account_id, amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    // Get current balance
    const getBalanceQuery = 'SELECT balance FROM accounts WHERE id = ?';
    const db = require('../config/db');
    
    db.execute(getBalanceQuery, [account_id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Account not found' 
        });
      }

      const currentBalance = parseFloat(results[0].balance);
      const newBalance = currentBalance + parseFloat(amount);

      // Update account balance
      Account.updateBalance(account_id, newBalance, (err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Error updating balance' 
          });
        }

        // Create transaction record
        Transaction.create({
          account_id,
          type: 'deposit',
          amount: parseFloat(amount),
          description: description || 'Deposit',
          balance_after: newBalance
        }, (err) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Error recording transaction' 
            });
          }

          res.json({
            success: true,
            message: 'Deposit successful',
            data: {
              new_balance: newBalance,
              transaction: {
                type: 'deposit',
                amount: parseFloat(amount),
                description: description || 'Deposit'
              }
            }
          });
        });
      });
    });
  },

  getAnalytics: (req, res) => {
    const userId = req.user.userId;

    Transaction.getAnalytics(userId, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }

      const analytics = results[0];
      res.json({
        success: true,
        data: {
          analytics: {
            total_balance: analytics.total_balance || 0,
            total_accounts: analytics.total_accounts,
            total_deposits: analytics.total_deposits || 0,
            total_withdrawals: analytics.total_withdrawals || 0
          }
        }
      });
    });
  }
};

module.exports = transactionController;