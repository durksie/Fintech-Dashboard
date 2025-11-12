const db = require('../config/db');

const Account = {
  findByUserId: (userId, callback) => {
    const query = `
      SELECT a.*, 
             (SELECT SUM(amount) FROM transactions t WHERE t.account_id = a.id AND t.type = 'deposit') as total_deposits,
             (SELECT SUM(amount) FROM transactions t WHERE t.account_id = a.id AND t.type = 'withdrawal') as total_withdrawals
      FROM accounts a 
      WHERE a.user_id = ?
    `;
    db.execute(query, [userId], callback);
  },

  create: (accountData, callback) => {
    const { user_id, account_number, account_type, balance } = accountData;
    const query = `
      INSERT INTO accounts (user_id, account_number, account_type, balance) 
      VALUES (?, ?, ?, ?)
    `;
    db.execute(query, [user_id, account_number, account_type, balance || 0], callback);
  },

  updateBalance: (accountId, newBalance, callback) => {
    const query = 'UPDATE accounts SET balance = ? WHERE id = ?';
    db.execute(query, [newBalance, accountId], callback);
  }
};

module.exports = Account;