import * as gamesRepo from '../repositories/game.repository.js'
import { BadRequest, NotFoundError } from '../utils/errors.js'

export const getGames = async () => {
    return await gamesRepo.findAll();
};

export const getGame = async (id) => {
    const game = await gamesRepo.findById(id);
    if(!game) throw new NotFoundError('That game doesnt exist!');

    return game;
}

export const createGame = async ({title, dev, genre, platform, release, image, notes}) => {
    if (!title || !dev || !genre || !platform || !release || !image || !notes) throw new BadRequest('Fields missing!');

    const created = await gamesRepo.create({title, dev, genre, platform, release, image, notes});
    if(!created) throw new BadRequest('Cant create game!');

    return created;
}

export const updateGame = async (id, {title, dev, genre, platform, release, status, hours, image, notes}) => {
    const game = await gamesRepo.findById(id);
    if(!game) throw new NotFoundError('That game doesnt exist!');

    const updated = await gamesRepo.update(id, {title, dev, genre, platform, release, status, hours, image, notes});
    if(!updated) throw new BadRequest('Cant update game!')

    return updated;
}

export const deleteGame = async (id) => {
    const game = await gamesRepo.findById(id);
    if(!game) throw new NotFoundError('That game doesnt exist!');

    await gamesRepo.del(id);
}