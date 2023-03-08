import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserCreateDto } from "./dto/user-create.dto";
import { UserGetDto } from "./dto/user-get.dto";
import { User } from "./user.entity";

import Exceptions from "./exceptions/user-create.exceptions";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dtoIn: UserCreateDto): Promise<User> {
    const isEmailAlreadyExists = await this.userRepository.findOneBy({
      email: dtoIn.email,
    });

    if (isEmailAlreadyExists) {
      throw new Exceptions.UserAlreadyExists({ email: dtoIn.email });
    }

    await this.userRepository.insert(dtoIn);

    return await this.userRepository.findOneBy({
      email: dtoIn.email,
    });
  }

  async get(dtoIn: UserGetDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: dtoIn.id });

    if (!user) {
      throw new Exceptions.UserDoesNotExist({ id: dtoIn.id });
    }

    return user;
  }
}
