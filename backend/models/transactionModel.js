const db = require('../config/db');

const Transaction = {
  findByAccountId: (accountId, limit = 10, callback) => {
    const query = `
      SELECT * FROM transactions 
      WHERE account_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    db.execute(query, [accountId, limit], callback);
  },

  create: (transactionData, callback) => {
    const { account_id, type, amount, description, recipient_account, balance_after } = transactionData;
    const query = `
      INSERT INTO transactions (account_id, type, amount, description, recipient_account, balance_after) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.execute(query, [account_id, type, amount, description, recipient_account, balance_after], callback);
  },

  getAnalytics: (userId, callback) => {
    const query = `
      SELECT 
        SUM(a.balance) as total_balance,
        COUNT(a.id) as total_accounts,
        (SELECT SUM(amount) FROM transactions t 
         JOIN accounts a ON t.account_id = a.id 
         WHERE a.user_id = ? AND t.type = 'deposit') as total_deposits,
        (SELECT SUM(amount) FROM transactions t 
         JOIN accounts a ON t.account_id = a.id 
         WHERE a.user_id = ? AND t.type = 'withdrawal') as total_withdrawals
      FROM accounts a 
      WHERE a.user_id = ?
    `;
    db.execute(query, [userId, userId, userId], callback);
  }
};

module.exports = Transaction;