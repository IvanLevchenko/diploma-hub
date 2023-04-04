import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  repositoryFilesIdList: string[];

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
  authorId: string;
}
