const db = require('../database/db');

const UserModel = {
  create: (name, phone, email, password) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)`,
        [name, phone, email, password],
        function (err) {
          if (err) reject(err);
          resolve({ id: this.lastID, name });
        }
      );
    });
  },
  
  findByUsername: (email) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  },
  saveToken: (token,user_id)  => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO sessions(user_id, user_token, is_expired)VALUES(?, ?, ?)`, [user_id, token, 0], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },
  getUserByToken: (token) => {

    return new Promise((resolve, reject) => {
      db.get(`SELECT 
                u.id,
                u.name,
                u.email,
                s.is_expired
              FROM 
                sessions as s,
                users as u
              WHERE 
              s.user_id = u.id AND
              s.is_expired = 0 AND
              s.user_token =?`, [token], (err, row) => {
                console.log(row,"****************************************************************");
                if (err) {
                  reject(err); // Handle database error
                  return;
                }
                if (!row) {
                  reject(new Error('token not present in database.')); // Handle no match case
                  return;
                }
                
                resolve(row); // Return the row if successful
              });
      });
    },
};

module.exports = UserModel;
