import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export abstract class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(10, {
    message: "Password should be at least 10 characters length.",
  })
  @IsString({ message: "Password should be a string." })
  password: string;

  @IsString()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MaxLength(30)
  lastName: string;
}
