import dotenv from "dotenv";
import path from "path";
import mysql from "mysql2/promise";

dotenv.config({ path: path.resolve("../.env") });


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.query('SELECT DATABASE() AS db')
  .then(([rows]) => console.log('Connected to database:', rows[0].db))
  .catch(err => console.error(err));

export default pool;