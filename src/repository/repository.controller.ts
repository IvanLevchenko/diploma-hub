import { Body, Controller, Post, Headers } from "@nestjs/common";

import { RepositoryCreateDto } from "./dto/repository-create.dto";
import { RepositoryService } from "./repository.service";

@Controller("repository")
export class RepositoryController {
  constructor(private repositoryService: RepositoryService) {}

  @Post("create")
  private async create(@Body() dtoIn: RepositoryCreateDto, @Headers() headers) {
    return this.repositoryService.create(dtoIn, headers.authorization);
  }
}
