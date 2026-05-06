import * as ratingRepo from '../repositories/rating.repository.js'
import * as gameRepo from '../repositories/game.repository.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

export const getByGameId = async (gameId) => {
    const game = await gameRepo.findById(gameId);
    if (!game) throw new NotFoundError('Game not found!');

    const rating = await ratingRepo.getByGameId(gameId);
    if (!rating) throw new NotFoundError('This game has no rating yet!');

    return rating;
};

export const upsert = async (gameId, body) => {
    const game = await gameRepo.findById(gameId);
    if (!game) throw new NotFoundError('Game not found!');

    const { score, review } = body;

    if (score === undefined) throw new ValidationError('score is required!');
    if (score < 0 || score > 10) throw new ValidationError('score must be between 0 and 10!');

    return await ratingRepo.upsert(gameId, { score, review });
};

export const remove = async (gameId) => {
    const game = await gameRepo.findById(gameId);
    if (!game) throw new NotFoundError('Game not found');

    const deleted = await ratingRepo.remove(gameId);
    if (!deleted) throw new NotFoundError('This game has no rating to delete');

    return deleted;
};
