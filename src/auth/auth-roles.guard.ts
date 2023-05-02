import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";

import { rolesKey } from "../common/decorators/roles.decorator";
import { AuthService } from "./auth.service";
import { AuthorizationResult } from "../common/types/authorization-result";
import { TokenPayload } from "../common/interfaces/token-payload";
import UserRoles from "../common/enums/user-roles.enum";

import Exceptions from "./exceptions/auth.exceptions";
import Constants from "../constants";

@Injectable()
export class AuthRolesGuard {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @Inject(AuthService) private authService: AuthService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<Promise<boolean> | Observable<boolean>> {
    const mustHaveRoles = this.reflector.getAllAndOverride<string[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const authorizationHeader = request.headers.authorization;
    const refreshToken = request.cookies?.refreshToken;

    if (!authorizationHeader || !refreshToken) {
      throw new Exceptions.UnauthorizedRequest({
        token: authorizationHeader,
      });
    }

    const token = authorizationHeader?.split(" ")[1];
    const verifiedResult = await this.verifyTokens(token, refreshToken);

    if (verifiedResult.updatedTokens) {
      response.cookie(
        "refreshToken",
        verifiedResult.updatedTokens.refreshToken,
        Constants.refreshTokenOptions,
      );
      request.headers.authorization = `Bearer ${verifiedResult.updatedTokens.token}`;
    }

    if (mustHaveRoles.includes(UserRoles.ALL)) {
      return true;
    }

    return mustHaveRoles.includes(verifiedResult.parsedToken.role);
  }

  private async verifyTokens(
    token: string,
    refreshToken: string,
  ): Promise<{
    parsedToken: TokenPayload;
    updatedTokens: AuthorizationResult;
  }> {
    let parsedToken;
    let updatedTokens;
    try {
      parsedToken = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (e) {
      try {
        parsedToken = this.jwtService.verify(refreshToken, {
          secret: process.env.SECRET_REFRESH_KEY,
        });
        updatedTokens = await this.refreshTokens(parsedToken.id, refreshToken);
      } catch (e) {
        throw new Exceptions.UnauthorizedRequest({});
      }
    }

    return {
      parsedToken,
      updatedTokens,
    };
  }

  private async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthorizationResult> {
    return await this.authService.updateRefreshToken({
      id: userId,
      refreshToken: refreshToken,
    });
  }
}
