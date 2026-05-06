import * as gamesService from '../services/game.service.js'

export const getAll = async (req, res, next) => {
    try {
        const { page, limit, q, sort, order, status } = req.query;

        const games = await gamesService.getGames({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            q,
            sort,
            order,
            status,
        });
        res.json({ success: true, data: games });
    } catch (err) {
        next(err);
    }
}

export const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const game = await gamesService.getGame(id);
        res.json({ success: true, data: game });
    } catch (err) {
        next(err);
    }
}

export const create = async (req, res, next) => {
    try {
        const { title, dev, genre, platform, release, status, hours, image, notes } = req.body;
        const game = await gamesService.createGame({ title, dev, genre, platform, release, status, hours, image, notes });
        res.json({ success: true, data: game });
    } catch (err) {
        next(err);
    }
}

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, dev, genre, platform, release, status, hours, image, notes } = req.body;
        const updated = await gamesService.updateGame(id, { title, dev, genre, platform, release, status, hours, image, notes });
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
}

export const del = async (req, res, next) => {
    try {
        const {id} = req.params;
        await gamesService.deleteGame(id);
        res.json({success: true, message: 'game eliminated!'});
    } catch (err) {
        next(err);
    }
}