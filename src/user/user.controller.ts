import { Body, Controller, Get, Post } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/user-create.dto";
import { User } from "./user.entity";
import { UserGetDto } from "./dto/user-get.dto";

@Controller("/user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/create")
  private create(@Body() dtoIn: UserCreateDto): Promise<User> {
    return this.userService.create(dtoIn);
  }

  @Get("/get")
  private get(@Body() dtoIn: UserGetDto): Promise<User> {
    return this.userService.get(dtoIn);
  }
}
