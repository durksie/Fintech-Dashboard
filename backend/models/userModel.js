const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (userData, callback) => {
    const { username, email, password, first_name, last_name } = userData;
    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);
      
      const query = `
        INSERT INTO users (username, email, password, first_name, last_name) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.execute(query, [username, email, hashedPassword, first_name, last_name], callback);
    });
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.execute(query, [email], callback);
  },

  findById: (id, callback) => {
    const query = 'SELECT id, username, email, first_name, last_name, created_at FROM users WHERE id = ?';
    db.execute(query, [id], callback);
  }
};

module.exports = User;