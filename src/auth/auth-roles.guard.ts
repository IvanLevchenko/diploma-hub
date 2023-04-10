import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

import { TokenPayload } from "../common/interfaces/token-payload";
import { rolesKey } from "../common/decorators/roles.decorator";
import { AuthService } from "./auth.service";

import Exceptions from "./exceptions/auth.exceptions";

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
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new Exceptions.UnauthorizedRequest({
        token: authorizationHeader,
      });
    }

    const bearer = authorizationHeader.split(" ")[0];
    const token = authorizationHeader.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      throw new Exceptions.UnauthorizedRequest({
        token: authorizationHeader,
      });
    }

    let parsedToken;
    try {
      parsedToken = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (e) {
      parsedToken = this.jwtService.decode(token) as TokenPayload;
      await this.authService.updateRefreshToken({
        id: parsedToken.id,
      });
    }

    return mustHaveRoles.includes(parsedToken.role);
  }
}
