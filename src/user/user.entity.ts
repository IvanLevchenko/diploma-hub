import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { UserRoles } from "../common/enums/user-roles.enum";
import { Group } from "../group/group.entity";

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

  @Column("text", { nullable: true })
  groupId: string | null;

  @ManyToOne(() => Group, (group) => group, {
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  group: Group;
}
