import { pool } from "./config/db.js";

async function testConnection() {
  try {
    const result = await pool.query(
      "SELECT current_database(), current_user, NOW()"
    );

    console.log("Database connection successful!");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testConnection();