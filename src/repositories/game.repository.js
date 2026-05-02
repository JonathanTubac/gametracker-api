import { pool } from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT * FROM games
    `);

    return rows;
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT * FROM games
        WHERE id = $1
    `, [id]);

    return rows[0] ?? null;
};

export const create = async ({title, dev, genre, platform, release, image, notes}) => {
    const { rows } = await pool.query(`
        INSERT INTO games (title, developer, genre, platform, release_year, cover_image, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [title, dev, genre, platform, release, image, notes]);

    return rows[0] ?? null;
}

export const update = async (id, {title, dev, genre, platform, release, status, hours, image, notes}) => {
    const {rows} = await pool.query(`
        UPDATE games
        SET title = $1, developer = $2, genre =$3, platform =$4, release_year = $5,
        status = $6, hours_played =$7, cover_image = $8, notes = $9
        WHERE id = $10
        RETURNING *
    `, [title, dev, genre, platform, release, status, hours, image, notes, id]);

    return rows[0];
}

export const del = async (id) => {
    await pool.query(`
        DELETE FROM games WHERE id = $1    
    `, [id]);
}