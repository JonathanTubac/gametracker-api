import { Pool } from "pg";
import 'dotenv/config'

export const pool = new Pool({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
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