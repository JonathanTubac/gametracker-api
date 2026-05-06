import * as ratingService from '../services/rating.service.js'

export const get = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rating = await ratingService.getByGameId(id);
        res.json({ success: true, data: rating });
    } catch (err) {
        next(err);
    }
};

export const upsert = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rating = await ratingService.upsert(id, req.body);
        res.status(201).json({ success: true, data: rating });
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await ratingService.remove(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};