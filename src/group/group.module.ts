import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";
import { Group } from "./group.entity";
import { User } from "../user/user.entity";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [TypeOrmModule.forFeature([Group, User]), UserModule],
})
export class GroupModule {}
