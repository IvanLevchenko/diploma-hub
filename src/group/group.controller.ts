import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { GroupService } from "./group.service";
import { Group } from "./group.entity";
import {
  GroupAddUsersDto,
  GroupCreateDto,
  GroupDeleteDto,
  GroupGetDto,
  GroupListDto,
  GroupRemoveUsersDto,
  GroupUpdateDto,
} from "./dto";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRoles } from "../common/enums/user-roles.enum";
import { AuthRolesGuard } from "../auth/auth-roles.guard";

@Controller("group")
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post("create")
  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthRolesGuard)
  private async create(
    @Body() dtoIn: GroupCreateDto,
    @Headers() headers,
  ): Promise<Group> {
    return this.groupService.create(dtoIn, headers.authorization);
  }

  @Get("list")
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER)
  @UseGuards(AuthRolesGuard)
  private async list(@Query() dtoIn: GroupListDto): Promise<Group[]> {
    return this.groupService.list(dtoIn);
  }

  @Get("get")
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER)
  @UseGuards(AuthRolesGuard)
  private async get(@Query() dtoIn: GroupGetDto): Promise<Group> {
    return this.groupService.get(dtoIn);
  }

  @Post("addUsers")
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER)
  @UseGuards(AuthRolesGuard)
  private async addUsers(@Body() dtoIn: GroupAddUsersDto): Promise<Group> {
    return this.groupService.addUsers(dtoIn);
  }

  @Patch("removeUsers")
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER)
  @UseGuards(AuthRolesGuard)
  private async removeUsers(
    @Body() dtoIn: GroupRemoveUsersDto,
  ): Promise<Group> {
    return this.groupService.removeUsers(dtoIn);
  }

  @Delete("delete")
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER)
  @UseGuards(AuthRolesGuard)
  private async delete(@Body() dtoIn: GroupDeleteDto): Promise<void> {
    return this.groupService.delete(dtoIn);
  }

  @Patch("update")
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER)
  @UseGuards(AuthRolesGuard)
  private async update(@Body() dtoIn: GroupUpdateDto): Promise<Group> {
    return this.groupService.update(dtoIn);
  }
}
