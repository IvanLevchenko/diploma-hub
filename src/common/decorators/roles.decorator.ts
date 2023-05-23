import { SetMetadata } from "@nestjs/common";

import { UserRoles } from "../enums/user-roles.enum";

export const rolesKey = "roles";

export const Roles = (...roles: UserRoles[]) => SetMetadata(rolesKey, roles);
