import {
  Body,
  Controller,
  Get,
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
  GroupGetDto,
  GroupListDto,
  GroupRemoveUsersDto,
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
  private async create(@Body() dtoIn: GroupCreateDto): Promise<Group> {
    return this.groupService.create(dtoIn);
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
}
