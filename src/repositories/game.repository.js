import { pool } from "../config/db.js";

export const findAll = async ({ page = 1, limit = 10, q, status, sort = 'created_at', order = 'desc' }) => {
    const offset = (page - 1) * limit;

    const validSortFields = ['title', 'release_year', 'hours_played', 'created_at', 'status'];
    const validOrder = ['asc', 'desc'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = validOrder.includes(order) ? order : 'desc';

    const conditions = [];
    const filterParams = [];

    if (q) {
        filterParams.push(`%${q}%`);
        conditions.push(`title ILIKE $${filterParams.length}`);
    }

    if (status) {
        filterParams.push(status);
        conditions.push(`status = $${filterParams.length}`);
    }

    const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await pool.query(
        `SELECT * FROM games${where} ORDER BY ${sortField} ${sortOrder} LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`,
        [...filterParams, limit, offset]
    );

    const { rows: statsRows } = await pool.query(
        `SELECT COUNT(*) as total, COALESCE(SUM(hours_played), 0) as total_hours FROM games${where}`,
        filterParams
    );
    const total      = parseInt(statsRows[0].total);
    const totalHours = parseFloat(statsRows[0].total_hours);

    return { data: rows, total, totalHours, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findById = async (id) => {
    const { rows } = await pool.query(`
        SELECT * FROM games
        WHERE id = $1
    `, [id]);

    return rows[0] ?? null;
};

export const create = async ({ title, dev, genre, platform, release, status, hours, image, notes }) => {
    const { rows } = await pool.query(`
        INSERT INTO games (title, developer, genre, platform, release_year, status, hours_played, cover_image, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `, [title, dev || null, genre || null, platform || null, release || null,
        status || 'backlog', hours || 0, image || null, notes || null]);

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