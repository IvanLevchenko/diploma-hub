import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import UserRoles from "../common/enums/user-roles.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { default: "" })
  refreshToken?: string;

  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text", { unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column("text")
  role: UserRoles;
}
