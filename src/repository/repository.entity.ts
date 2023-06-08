import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../user/user.entity";
import { File } from "../file/file.entity";

@Entity()
export class Repository {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name: string;

  @Column("text", { array: true, default: () => "'{}'" })
  filesIdList: string[];

  @Column("text")
  subject: string;

  @Column("text", { array: true })
  groups: string[];

  @Column("uuid")
  authorId: string;

  @CreateDateColumn()
  created: Date | string;

  @ManyToOne(() => User, (user) => user, { onDelete: "CASCADE" })
  @JoinColumn()
  author: User;

  @OneToMany(() => File, (file) => file.repository)
  @JoinColumn()
  filesList: File[];
}
