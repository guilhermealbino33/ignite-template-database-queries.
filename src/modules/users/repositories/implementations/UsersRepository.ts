import { userInfo } from "os";
import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const users = await this.repository
      .createQueryBuilder("users")
      .innerJoinAndSelect("users.games", "games")
      .where("users.id = :id", { id: user_id })
      .andWhere("user.games != null")
      .getOneOrFail();

    return users;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("select * from users order by first_name asc");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      "select * from users where (lower(users.first_name) = lower($1)) and (lower(users.last_name) = lower($2))",
      [first_name, last_name]
    );
  }
}
