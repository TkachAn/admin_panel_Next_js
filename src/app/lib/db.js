//src/app/lib/db.js
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', // Используем 'root' по умолчанию, предполагая твои .env
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'garden_plots',
  port: process.env.DB_PORT || 3306,
});

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.execute(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

export default query;