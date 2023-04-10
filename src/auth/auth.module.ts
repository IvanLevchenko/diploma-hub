import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { AuthRolesGuard } from "./auth-roles.guard";

@Global()
@Module({
  providers: [AuthService, AuthRolesGuard],
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      signOptions: { expiresIn: "24h" },
    }),
    UserModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
