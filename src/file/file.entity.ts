import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

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
  author: string;

  @Column("uuid")
  @OneToOne(() => Repository)
  @JoinColumn()
  repository: string;
}
