import { Pool } from "pg";
import 'dotenv/config'

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.NODE_ENV === 'production'
        ? {rejectUnauthorized: false}
        : false
})

export const connect = async () => {
    try {
        await pool.query(`
           SELECT 1 
        `);
        console.log("✅Connected with postgresql");
    } catch (err) {
        console.log("❌ Error connecting with postgres")
        process.exit(1)
    }
}