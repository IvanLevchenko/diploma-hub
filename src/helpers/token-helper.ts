import { JwtService } from "@nestjs/jwt";

import { User } from "../user/user.entity";
import { AuthorizationResult } from "../common/types/authorization-result";
import { UserService } from "../user/user.service";
import { TokenPayload } from "../common/interfaces/token-payload";

class TokenHelper {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateTokens(user: User): Promise<AuthorizationResult> {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET_REFRESH_KEY,
    });

    await this.userService.update({
      id: user.id,
      refreshToken,
    });

    return {
      token,
      refreshToken,
    };
  }

  decodeToken(token: string): TokenPayload {
    return this.jwtService.decode(token.split(" ")[1]) as TokenPayload;
  }
}

export default TokenHelper;
