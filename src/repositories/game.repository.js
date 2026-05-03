import { pool } from "../config/db.js";

export const findAll = async ({ page = 1, limit = 10, q, sort = 'created_at', order = 'desc' }) => {
    const offset = (page - 1) * limit;

    const validSortFields = ['title', 'release_year', 'hours_played', 'created_at', 'status'];
    const validOrder = ['asc', 'desc'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = validOrder.includes(order) ? order : 'desc';

    let query = `SELECT * FROM games`;
    const params = [];

    if (q) {
        params.push(`%${q}%`);
        query += ` WHERE title ILIKE $${params.length}`;
    }

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    params.push(limit);
    query += ` LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const { rows } = await pool.query(query, params);

    let countQuery = `SELECT COUNT(*) FROM games`;
    const countParams = [];
    if (q) {
        countParams.push(`%${q}%`);
        countQuery += ` WHERE title ILIKE $1`;
    }
    const { rows: countRows } = await pool.query(countQuery, countParams);
    const total = parseInt(countRows[0].count);

    return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT * FROM games
        WHERE id = $1
    `, [id]);

    return rows[0] ?? null;
};

export const create = async ({ title, dev, genre, platform, release, image, notes }) => {
    const { rows } = await pool.query(`
        INSERT INTO games (title, developer, genre, platform, release_year, cover_image, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [title, dev, genre, platform, release, image, notes]);

    return rows[0] ?? null;
}

export const update = async (id, { title, dev, genre, platform, release, status, hours, image, notes }) => {
    const { rows } = await pool.query(`
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