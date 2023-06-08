import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { PublicUser } from "../user/types/public-user";
import { User } from "../user/user.entity";

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name: string;

  @Column("text", { array: true, default: () => "'{}'" })
  userIdList: string[];

  @Column("uuid")
  authorId: string;

  @OneToMany(() => User, (user) => user.group)
  @JoinColumn()
  userList: PublicUser[];
}
