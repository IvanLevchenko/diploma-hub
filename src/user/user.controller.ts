import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  HttpCode,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserGetDto } from "./dto/user-get.dto";
import { UserCastToRoleDto } from "./dto/user-cast-to-role.dto";
import { Roles } from "../common/decorators/roles.decorator";
import UserRoles from "../common/enums/user-roles.enum";
import { AuthRolesGuard } from "../auth/auth-roles.guard";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("get")
  @HttpCode(HttpStatus.OK)
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
