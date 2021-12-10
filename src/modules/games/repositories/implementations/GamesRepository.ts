import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";
import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .select("games.title", "title")
      .from(Game, "games")
      .where("games.title = :title", { title: param })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(*) from games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "user")
      .where("games.id = :id", { id })
      .getOneOrFail();

    const { users } = games;
    return users;
  }
}
