import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import { UserService } from "../user/user.service";
import { AuthorizationResult } from "../common/types/authorization-result";
import TokenHelper from "../helpers/token-helper";
import {
  IsAuthorizedDto,
  LoginDto,
  LogoutServiceDto,
  RegisterDto,
  UpdateRefreshTokenDto,
} from "./dto";
import { IsAuthorized } from "./interfaces/is-authorized";

import RegisterExceptions from "./exceptions/register.exceptions";
import LoginExceptions from "./exceptions/login.exceptions";
import IsAuthorizedExceptions from "./exceptions/is-authorized.exceptions";

@Injectable()
export class AuthService {
  private tokenHelper = new TokenHelper(this.jwtService, this.userService);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async login(dtoIn: LoginDto): Promise<AuthorizationResult> {
    const user = await this.userService.getByEmail({ email: dtoIn.email });

    if (!user) {
      throw new LoginExceptions.UserDoesNotExist({ email: dtoIn.email });
    }

    const isCorrectPassword = await bcrypt.compare(
      dtoIn.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new LoginExceptions.UserAuthorizationFailed({});
    }

    const tokens = await this.tokenHelper.generateTokens(user);

    await this.userService.update({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  public async register(dtoIn: RegisterDto): Promise<AuthorizationResult> {
    const isEmailExists = await this.userService.getByEmail({
      email: dtoIn.email,
    });

    if (isEmailExists) {
      throw new RegisterExceptions.UserAlreadyExists({ email: dtoIn.email });
    }

    const hashedPassword = await bcrypt.hash(dtoIn.password, 6);

    await this.userService.create({
      ...dtoIn,
      password: hashedPassword,
    });

    return await this.login({
      email: dtoIn.email,
      password: dtoIn.password,
    });
  }

  public async logout(dtoIn: LogoutServiceDto): Promise<void> {
    const parsedToken = this.tokenHelper.decodeToken(
      `${dtoIn.authorizationHeader}`,
    );

    await this.userService.update({
      id: parsedToken.id,
      refreshToken: "",
    });
  }

  public async isAuthorized(dtoIn: IsAuthorizedDto): Promise<IsAuthorized> {
    const token = dtoIn.authorizationHeader.split(" ")[1];
    const refreshToken = dtoIn.refreshToken;

    if (!token || !refreshToken) {
      throw new IsAuthorizedExceptions.UserIsNotAuthorized({});
    }

    let response: IsAuthorized;

    const isAuthorized = this.tokenHelper.isTokenValid(
      dtoIn.authorizationHeader,
      false,
    );
    const isRefreshToken = this.tokenHelper.isTokenValid(
      dtoIn.refreshToken,
      true,
    );

    if (isAuthorized || isRefreshToken) {
      const token = isAuthorized
        ? dtoIn.authorizationHeader
        : dtoIn.refreshToken;
      const decodedToken = this.tokenHelper.decodeToken(token);
      const user = await this.userService.get({ id: decodedToken.id });

      if (user.refreshToken !== dtoIn.refreshToken) {
        throw new LoginExceptions.UserAuthorizationFailed({
          refreshToken: dtoIn.refreshToken,
        });
      }
    }

    if (!isAuthorized && !isRefreshToken) {
      response = {
        isAuthorized: false,
      };
    } else if (!isAuthorized && isRefreshToken) {
      const tokenPayload = this.tokenHelper.decodeToken(
        dtoIn.authorizationHeader,
      );
      const tokens = await this.updateRefreshToken({
        id: tokenPayload.id,
        refreshToken: dtoIn.refreshToken,
      });

      response = {
        isAuthorized: true,
        tokenPayload: this.tokenHelper.decodeToken(tokens.token),
        tokens,
      };
    } else {
      response = {
        isAuthorized: true,
        tokenPayload: this.tokenHelper.decodeToken(dtoIn.authorizationHeader),
      };
    }

    return response;
  }

  public async updateRefreshToken(
    dtoIn: UpdateRefreshTokenDto,
  ): Promise<AuthorizationResult> {
    const user = await this.userService.get({ id: dtoIn.id });

    if (dtoIn.refreshToken !== user.refreshToken) {
      throw new LoginExceptions.UserAuthorizationFailed({
        refreshToken: dtoIn.refreshToken,
      });
    }

    const tokens = await this.tokenHelper.generateTokens(user);
    await this.userService.update({
      id: dtoIn.id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }
}
