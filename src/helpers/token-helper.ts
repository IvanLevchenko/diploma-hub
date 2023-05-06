import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/user.entity";
import { AuthorizationResult } from "../common/types/authorization-result";
import { UserService } from "../user/user.service";
import { TokenPayload } from "../common/interfaces/token-payload";

@Injectable()
class TokenHelper {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  public async generateTokens(user: User): Promise<AuthorizationResult> {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: "1d",
    });
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.SECRET_REFRESH_KEY,
        expiresIn: "3d",
      },
    );

    await this.userService.update({
      id: user.id,
      refreshToken,
    });

    return {
      token,
      refreshToken,
    };
  }

  private removeBearer(token: string): string {
    if (token.includes("Bearer")) {
      token = token.split(" ")[1];
    }

    return token;
  }

  public decodeToken(token: string): TokenPayload {
    token = this.removeBearer(token);
    return this.jwtService.decode(token) as TokenPayload;
  }

  public isTokenValid(token: string): boolean {
    token = this.removeBearer(token);
    try {
      this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    } catch (e) {
      return false;
    }

    return true;
  }
}

export default TokenHelper;
