import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RepositoryController } from "./repository.controller";
import { RepositoryService } from "./repository.service";
import { Repository } from "./repository.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Repository]), UserModule],
  controllers: [RepositoryController],
  providers: [RepositoryService],
})
export class RepositoryModule {}
