import { IsEmail } from "class-validator";

export abstract class UserGetByEmailDto {
  @IsEmail()
  email: string;
}
