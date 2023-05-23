import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { Repository } from "./repository.entity";
import { RepositoryService } from "./repository.service";
import {
  RepositoryCreateDto,
  RepositoryDeleteDto,
  RepositoryGetDto,
  RepositoryListDto,
} from "./dto";
import { RepositoryWithAuthor } from "./types/repository-with-author";

import { AuthRolesGuard } from "../auth/auth-roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRoles } from "../common/enums/user-roles.enum";

@Controller("repository")
export class RepositoryController {
  constructor(private repositoryService: RepositoryService) {}

  @Post("create")
  @Roles(UserRoles.TEACHER, UserRoles.ADMIN)
  @UseGuards(AuthRolesGuard)
  private async create(
    @Body() dtoIn: RepositoryCreateDto,
    @Headers() headers,
  ): Promise<Repository> {
    return this.repositoryService.create(dtoIn, headers.authorization);
  }

  @Get("get")
  @Roles(UserRoles.ALL)
  @UseGuards(AuthRolesGuard)
  private async get(
    @Query() dtoIn: RepositoryGetDto,
  ): Promise<RepositoryWithAuthor> {
    return this.repositoryService.get(dtoIn);
  }

  @Get("list")
  @Roles(UserRoles.ALL)
  @UseGuards(AuthRolesGuard)
  private async list(
    @Query() dtoIn: RepositoryListDto,
  ): Promise<RepositoryWithAuthor[]> {
    return this.repositoryService.list(dtoIn);
  }

  @Delete("delete")
  @Roles(UserRoles.TEACHER, UserRoles.ADMIN)
  @UseGuards(AuthRolesGuard)
  @HttpCode(200)
  private async delete(@Body() dtoIn: RepositoryDeleteDto): Promise<void> {
    return this.repositoryService.delete(dtoIn);
  }
}
