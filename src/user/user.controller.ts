import { Body, Controller, Get } from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserGetDto } from "./dto/user-get.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("get")
  private get(@Body() dtoIn: UserGetDto): Promise<User> {
    return this.userService.get(dtoIn);
  }
}
