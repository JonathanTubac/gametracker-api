import { pool } from "../config/db.js";

export const getByGameId = async (gameId) => {
    const { rows } = await pool.query(
        `SELECT * FROM ratings WHERE game_id = $1`,
        [gameId]
    );
    return rows[0] || null;
};

export const upsert = async (gameId, { score, review }) => {
    const { rows } = await pool.query(
        `INSERT INTO ratings (game_id, score, review)
     VALUES ($1, $2, $3)
     ON CONFLICT (game_id)
     DO UPDATE SET score = $2, review = $3, updated_at = NOW()
     RETURNING *`,
        [gameId, score, review]
    );

    return rows[0];
};

export const remove = async (gameId) => {
    const { rows } = await pool.query(
        `DELETE FROM ratings WHERE game_id = $1 RETURNING *`,
        [gameId]
    );
    return rows[0] || null;
};