import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { FileModule } from "./file/file.module";
import { RepositoryModule } from "./repository/repository.module";

import { User } from "./user/user.entity";
import { Repository } from "./repository/repository.entity";
import { File } from "./file/file.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [User, File, Repository],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    FileModule,
    RepositoryModule,
  ],
})
export class AppModule {}
