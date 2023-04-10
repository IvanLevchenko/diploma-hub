import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response as ExpressResponse } from "express";

import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { AuthorizationResult } from "../common/types/authorization-result";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  private async login(
    @Body() dtoIn: LoginDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<AuthorizationResult> {
    const tokens = await this.authService.login(dtoIn);

    return this.setRefreshTokenAndReturn(tokens, response);
  }

  @Post("register")
  private async register(
    @Body() dtoIn: RegisterDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<AuthorizationResult> {
    const tokens = await this.authService.register(dtoIn);

    return this.setRefreshTokenAndReturn(tokens, response);
  }

  private setRefreshTokenAndReturn(
    tokens: AuthorizationResult,
    response: ExpressResponse,
  ) {
    response.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
    });

    return {
      token: tokens.token,
    };
  }
}
