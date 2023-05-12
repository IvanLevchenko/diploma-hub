import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { File } from "./file.entity";
import { UserModule } from "../user/user.module";
import { Repository } from "../repository/repository.entity";

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads/pdf",
    }),
    TypeOrmModule.forFeature([File, Repository]),
    UserModule,
    JwtModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
