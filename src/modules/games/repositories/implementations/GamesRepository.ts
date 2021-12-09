import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    
    return await this.repository.createQueryBuilder()
    .leftJoinAndSelect("games.title", "title")
    .where("title = :title", {title: param}).getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("games")
  
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder()
      // Complete usando query builder
  }
}
