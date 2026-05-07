import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const connect = async () => {
  try {
    await pool.query('SELECT 1');
    console.log("✅ Connected with postgresql");
  } catch (err) {
    console.error("❌ Error connecting with postgres:", err.message);
    throw err;
  }
}