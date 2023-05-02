import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./user.entity";
import UserRoles from "../common/enums/user-roles.enum";
import {
  UserCastToRoleDto,
  UserCreateDto,
  UserGetByEmailDto,
  UserGetDto,
  UserUpdateDto,
} from "./dto";

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

  async update(dtoIn: UserUpdateDto) {
    const user = await this.userRepository.findOneBy({ id: dtoIn.id });

    if (!user) {
      throw new Exceptions.UserDoesNotExist({ id: dtoIn.id });
    }

    await this.userRepository.update({ id: dtoIn.id }, dtoIn);

    return {
      ...user,
      ...dtoIn,
    };
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

  async castToRole(dtoIn: UserCastToRoleDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: dtoIn.id });

    if (!user) {
      throw new Exceptions.UserDoesNotExist({ id: dtoIn.id });
    }

    return this.userRepository.save({ ...user, role: dtoIn.role });
  }
}
