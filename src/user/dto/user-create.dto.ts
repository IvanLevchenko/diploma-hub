import { IsString, IsEmail, MinLength, IsIn, MaxLength } from "class-validator";

import UserRoles from "../../common/enums/user-roles.enum";

export abstract class UserCreateDto {
  @IsString()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MaxLength(30)
  lastName: string;

  @IsString()
  @MinLength(10)
  password: string;

  @IsEmail()
  email: string;

  @IsIn(Object.values(UserRoles))
  role: UserRoles;
}
