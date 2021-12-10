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
    return this.repository
      .createQueryBuilder("users")
      .innerJoinAndSelect("users.games", "games")
      .where("users.id = :id", { id: user_id })
      .getOneOrFail();
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("select * from users order by first_name");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      "select users.first_name, users.last_name from users where users.first_name = :first_name and users.last_name = :last_name",
      [first_name, last_name]
    );
  }
}
