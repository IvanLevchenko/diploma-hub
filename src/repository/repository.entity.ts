import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../user/user.entity";

@Entity()
export class Repository {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name: string;

  @Column("text", { array: true, default: () => "'{}'" })
  repositoryFilesIdList: string[];

  @Column("text")
  subject: string;

  @Column("text", { array: true })
  groups: string[];

  @Column("uuid")
  authorId: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  author: User;

  @CreateDateColumn()
  created: Date;
}
