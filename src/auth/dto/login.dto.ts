import { IsEmail, IsString, MinLength } from "class-validator";

export abstract class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(10, {
    message: "Password should be at least 10 characters length.",
  })
  @IsString({ message: "Password should be a string." })
  password: string;
}
