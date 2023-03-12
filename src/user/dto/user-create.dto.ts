import { IsString, IsEmail, MinLength, MaxLength } from "class-validator";

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
}
