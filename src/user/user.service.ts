import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserCreateDto } from "./dto/user-create.dto";
import { UserGetDto } from "./dto/user-get.dto";
import { User } from "./user.entity";
import { UserGetByEmailDto } from "./dto/user-get-by-email.dto";
import UserRoles from "../common/enums/user-roles.enum";

import Exceptions from "./exceptions/user-create.exceptions";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dtoIn: UserCreateDto): Promise<User> {
    return this.userRepository.save({
      ...dtoIn,
      role: UserRoles.STUDENT,
    });
  }

  async get(dtoIn: UserGetDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: dtoIn.id });

    if (!user) {
      throw new Exceptions.UserDoesNotExist({ id: dtoIn.id });
    }

    return user;
  }

  async getByEmail(dtoIn: UserGetByEmailDto): Promise<User | null> {
    return await this.userRepository.findOneBy({ email: dtoIn.email });
  }
}
