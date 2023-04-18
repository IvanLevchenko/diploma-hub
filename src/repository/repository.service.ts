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

import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import TokenHelper from "../helpers/token-helper";
import { RepositoryWithAuthor } from "./types/repository-with-author";
import { Optional } from "../common/types/optional";

import Exceptions from "./exceptions/get.exceptions";

type RepositoryWithOptionalAuthData = Omit<Repository, "author"> & {
  author: Optional<User, "refreshToken" | "password">;
};

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
      authorId: decodedToken.id,
    });
  }

  async get(dtoIn: RepositoryGetDto): Promise<RepositoryWithAuthor> {
    const repository = (await this.repositoryRepository.findOne({
      where: { id: dtoIn.id },
      relations: ["author"],
    })) as RepositoryWithOptionalAuthData;

    if (!repository) {
      throw new Exceptions.RepositoryDoesNotExist({ id: dtoIn.id });
    }

    delete repository.author.refreshToken;
    delete repository.author.password;

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
