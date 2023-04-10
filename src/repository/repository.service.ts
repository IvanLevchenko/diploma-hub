import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository as TypeOrmRepository } from "typeorm";

import { Repository } from "./repository.entity";
import {
  RepositoryCreateDto,
  RepositoryDeleteDto,
  RepositoryGetDto,
  RepositoryListDto,
} from "./dto";

import { UserService } from "../user/user.service";
import TokenHelper from "../helpers/token-helper";

import Exceptions from "./exceptions/get.exceptions";

@Injectable()
export class RepositoryService {
  private tokenHelper = new TokenHelper(this.jwtService, this.userService);
  constructor(
    @InjectRepository(Repository)
    private repositoryRepository: TypeOrmRepository<Repository>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async create(
    dtoIn: RepositoryCreateDto,
    authorizationHeader: string,
  ): Promise<Repository> {
    const decodedToken = this.tokenHelper.decodeToken(authorizationHeader);
    return await this.repositoryRepository.save({
      ...dtoIn,
      author: decodedToken.id,
    });
  }

  async get(dtoIn: RepositoryGetDto): Promise<Repository> {
    const repository = await this.repositoryRepository.findOne({
      where: { id: dtoIn.id },
      relations: ["author"],
    });

    if (!repository) {
      throw new Exceptions.RepositoryDoesNotExist({ id: dtoIn.id });
    }

    if (typeof repository.author !== "string") {
      delete repository.author.password;
      delete repository.author.refreshToken;
    }

    return repository;
  }

  async list(dtoIn: RepositoryListDto): Promise<Repository[]> {
    const filter = {
      skip: dtoIn.pageInfo?.page,
      take: dtoIn.pageInfo?.pageSize,
    };

    return await this.repositoryRepository.find({
      take: filter.take,
      skip: filter.skip,
    });
  }

  async delete(dtoIn: RepositoryDeleteDto): Promise<void> {
    await this.repositoryRepository.delete({ id: dtoIn.id });
  }
}
