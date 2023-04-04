import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository as TypeOrmRepository } from "typeorm";

import { Repository } from "./repository.entity";
import { RepositoryCreateDto } from "./dto/repository-create.dto";
import TokenHelper from "../helpers/token-helper";
import { UserService } from "../user/user.service";

@Injectable()
export class RepositoryService {
  private tokenHelper = new TokenHelper(this.jwtService, this.userService);
  constructor(
    @InjectRepository(Repository)
    private repositoryRepository: TypeOrmRepository<Repository>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async create(dtoIn: RepositoryCreateDto, authorizationHeader: string) {
    const decodedToken = this.tokenHelper.decodeToken(authorizationHeader);
    return await this.repositoryRepository.save({
      ...dtoIn,
      authorId: decodedToken.id,
    });
  }
}
