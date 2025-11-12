const Account = require('../models/accountModel');

const accountController = {
  getAccounts: (req, res) => {
    const userId = req.user.userId;

    Account.findByUserId(userId, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }

      res.json({
        success: true,
        data: {
          accounts: results
        }
      });
    });
  },

  createAccount: (req, res) => {
    const userId = req.user.userId;
    const { account_type } = req.body;
    
    // Generate unique account number
    const account_number = 'ACC' + Date.now();

    Account.create({
      user_id: userId,
      account_number,
      account_type: account_type || 'checking'
    }, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error creating account' 
        });
      }

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          account: {
            id: results.insertId,
            account_number,
            account_type,
            balance: 0
          }
        }
      });
    });
  }
};

module.exports = accountController;