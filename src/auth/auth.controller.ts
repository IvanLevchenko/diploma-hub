import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthorizationResult } from "../common/types/authorization-result";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  private async login(@Body() dtoIn: LoginDto): Promise<AuthorizationResult> {
    return this.authService.login(dtoIn);
  }

  @Post("register")
  private async register(
    @Body() dtoIn: RegisterDto,
  ): Promise<AuthorizationResult> {
    return this.authService.register(dtoIn);
  }
}
