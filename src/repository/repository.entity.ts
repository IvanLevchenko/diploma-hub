import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../user/user.entity";
import { Optional } from "../common/types/optional";

@Entity()
export class Repository {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name: string;

  @Column({
    type: "jsonb",
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  repositoryFilesList: string[];

  @Column("text")
  subject: string;

  @Column({
    type: "jsonb",
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  groups: string[];

  @Column("uuid")
  @OneToOne(() => User)
  @JoinColumn()
  author: string | Optional<User, "password" | "refreshToken">;

  @CreateDateColumn()
  created: Date;
}
