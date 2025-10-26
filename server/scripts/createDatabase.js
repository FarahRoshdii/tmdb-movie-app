import dotenv from "dotenv";
import path from "path";
import mysql from "mysql2/promise";

dotenv.config({ path: path.resolve("../.env") });



const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database "${DB_NAME}" created or already exists.`);

    await connection.end();
    console.log("Database setup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Database setup failed:", err.message);
    process.exit(1);
  }
}

createDatabase();
