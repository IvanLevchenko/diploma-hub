import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

import { rolesKey } from "../common/decorators/roles.decorator";

import Exceptions from "./exceptions/auth.exceptions";
import * as process from "process";

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const mustHaveRoles = this.reflector.getAllAndOverride<string[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    const bearer = authorizationHeader.split(" ")[0];
    const token = authorizationHeader.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      throw new Exceptions.UnauthorizedRequest({
        token: authorizationHeader,
      });
    }

    const parsedToken = this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });

    console.log(mustHaveRoles, parsedToken.role, parsedToken, "<-----");

    return mustHaveRoles.includes(parsedToken.role);
  }
}
