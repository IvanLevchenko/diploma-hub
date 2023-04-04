import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
