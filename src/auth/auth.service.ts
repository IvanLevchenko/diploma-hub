import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthorizationResult } from "../common/types/authorization-result";

import RegisterExceptions from "./exceptions/register.exceptions";
import LoginExceptions from "./exceptions/login.exceptions";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dtoIn: LoginDto): Promise<AuthorizationResult> {
    const user = await this.userService.getByEmail({ email: dtoIn.email });

    if (!user) {
      throw new LoginExceptions.UserDoesNotExist({ email: dtoIn.email });
    }

    const isCorrectPassword = await bcrypt.compare(
      dtoIn.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new LoginExceptions.UserAuthorizationFailed();
    }

    return this.generateToken(user);
  }
  async register(dtoIn: RegisterDto): Promise<AuthorizationResult> {
    const isEmailExists = await this.userService.getByEmail({
      email: dtoIn.email,
    });

    if (isEmailExists) {
      throw new RegisterExceptions.UserAlreadyExists({ email: dtoIn.email });
    }

    const hashedPassword = await bcrypt.hash(dtoIn.password, 6);
    const user = await this.userService.create({
      ...dtoIn,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  private generateToken(user: User): AuthorizationResult {
    const payload = { id: user.id, email: user.email, role: user.role };
    return { token: this.jwtService.sign(payload) };
  }
}
