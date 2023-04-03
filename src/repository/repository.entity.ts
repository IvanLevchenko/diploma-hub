import { Column, Entity } from "typeorm";

@Entity()
export class Repository {
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
