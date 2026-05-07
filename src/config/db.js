import { Pool } from "pg";

const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1') || process.env.DATABASE_URL?.includes('@db:');

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
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