import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from "class-validator";

export abstract class UserUpdateDto {
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  lastName?: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
