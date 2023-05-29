import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository as TypeOrmRepository,
} from "typeorm";

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
  public async create(
    dtoIn: RepositoryCreateDto,
    authorizationHeader: string,
  ): Promise<Repository> {
    const decodedToken = this.tokenHelper.decodeToken(authorizationHeader);
    return await this.repositoryRepository.save({
      ...dtoIn,
      authorId: decodedToken.id,
    });
  }

  public async get(dtoIn: RepositoryGetDto): Promise<RepositoryWithAuthor> {
    const repository = (await this.repositoryRepository.findOne({
      where: { id: dtoIn.id },
      relations: ["author", "filesList"],
    })) as RepositoryWithOptionalAuthData;

    if (!repository) {
      throw new Exceptions.RepositoryDoesNotExist({ id: dtoIn.id });
    }

    delete repository.author.refreshToken;
    delete repository.author.password;

    return repository;
  }

  public async list(dtoIn: RepositoryListDto): Promise<RepositoryWithAuthor[]> {
    const filter = this.getFilterList(dtoIn);

    const repositories = (await this.repositoryRepository.find({
      skip: dtoIn.pageInfo?.page,
      take: dtoIn.pageInfo?.pageSize,
      where: filter,
      relations: ["author"],
    })) as RepositoryWithOptionalAuthData[];

    return repositories.map((repository) => {
      delete repository.author.refreshToken;
      delete repository.author.password;
      return repository;
    });
  }

  public async delete(dtoIn: RepositoryDeleteDto): Promise<void> {
    await this.repositoryRepository.delete({ id: dtoIn.id });
  }

  private getFilterList(dtoIn): FindOptionsWhere<Repository> {
    const filter: FindOptionsWhere<Repository> = {};
    if (dtoIn.dateFrom && dtoIn.dateTo) {
      filter.created = Between(dtoIn.dateFrom, dtoIn.dateFrom);
    } else if (dtoIn.dateFrom) {
      filter.created = MoreThanOrEqual(dtoIn.dateFrom);
    } else if (dtoIn.dateTo) {
      filter.created = LessThanOrEqual(dtoIn.dateTo);
    }

    if (dtoIn.subjects?.length) {
      filter.subject = In(dtoIn.subjects);
    }

    if (dtoIn.name) {
      filter.name = Like(`%${dtoIn.name}%`);
    }

    return filter;
  }
}
