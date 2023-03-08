import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import UserRoles from "../common/enums/user-roles.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column("text")
  role: UserRoles;
}
