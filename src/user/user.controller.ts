import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserCastToRoleDto, UserGetDto } from "./dto";

import { Roles } from "../common/decorators/roles.decorator";
import { UserRoles } from "../common/enums/user-roles.enum";
import { AuthRolesGuard } from "../auth/auth-roles.guard";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("get")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthRolesGuard)
  private get(@Query() dtoIn: UserGetDto): Promise<User | HttpException> {
    return this.userService.get(dtoIn);
  }

  @Patch("castToRole")
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthRolesGuard)
  private castToRole(
    @Body() dtoIn: UserCastToRoleDto,
  ): Promise<User | HttpException> {
    return this.userService.castToRole(dtoIn);
  }
}
