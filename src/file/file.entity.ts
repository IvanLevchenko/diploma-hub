import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Repository } from "../repository/repository.entity";

@Entity()
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  filename: string;

  @Column("text")
  filepath: string;

  @Column("uuid")
  authorId: string;

  @Column("uuid")
  repositoryId: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  author: User;

  @ManyToOne(() => Repository, (repository) => repository)
  @JoinColumn()
  repository: Repository;
}
