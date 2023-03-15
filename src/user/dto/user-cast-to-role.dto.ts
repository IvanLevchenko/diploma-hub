import { IsString, IsUUID, IsIn } from "class-validator";

import UserRoles from "../../common/enums/user-roles.enum";

export abstract class UserCastToRoleDto {
  @IsUUID()
  id: string;

  @IsString({ message: "Role must be a string." })
  @IsIn(Object.values(UserRoles), {
    message: `Role must be one of the following values: ${UserCastToRoleDto.getRoleList()}`,
  })
  role: UserRoles;

  private static getRoleList(): string {
    const roles = Object.values(UserRoles);
    return roles.join(",").replaceAll(",", ", ");
  }
}
