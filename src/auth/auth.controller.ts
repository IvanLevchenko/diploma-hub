import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { LoginDto, LogoutDto, RegisterDto } from "./dto";
import { AuthorizationResult } from "../common/types/authorization-result";
import { AuthRolesGuard } from "./auth-roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRoles } from "../common/enums/user-roles.enum";
import { IsAuthorizedResponse } from "./interfaces/is-authorized-response";

import Constants from "../constants";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  private async login(
    @Body() dtoIn: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizationResult> {
    const tokens = await this.authService.login(dtoIn);

    return this.setRefreshTokenAndReturn(tokens, response);
  }

  @Post("logout")
  @Roles(UserRoles.ALL)
  @UseGuards(AuthRolesGuard)
  private async logout(
    @Body() dtoIn: LogoutDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const authorizationHeader = request.headers.authorization;

    response.clearCookie("refreshToken");
    return await this.authService.logout({ authorizationHeader });
  }

  @Get("isAuthorized")
  private async isAuthorized(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IsAuthorizedResponse> {
    const isAuthorizedResult = await this.authService.isAuthorized({
      authorizationHeader: `${request.headers.authorization}`,
      refreshToken: request.cookies.refreshToken,
    });
    const isAuthorizedResponse: IsAuthorizedResponse = {
      isAuthorized: isAuthorizedResult.isAuthorized,
    };

    if (isAuthorizedResult.tokens) {
      this.setRefreshTokenAndReturn(isAuthorizedResult.tokens, response);
      isAuthorizedResponse.token = isAuthorizedResult.tokens.token;
    }

    if (isAuthorizedResult.tokenPayload) {
      isAuthorizedResponse.tokenPayload = isAuthorizedResult.tokenPayload;
    }

    return isAuthorizedResponse;
  }

  @Post("register")
  private async register(
    @Body() dtoIn: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizationResult> {
    const tokens = await this.authService.register(dtoIn);

    return this.setRefreshTokenAndReturn(tokens, response);
  }

  private setRefreshTokenAndReturn(
    tokens: AuthorizationResult,
    response: Response,
  ) {
    response.cookie(
      "refreshToken",
      tokens.refreshToken,
      Constants.refreshTokenOptions,
    );

    return {
      token: tokens.token,
    };
  }
}
