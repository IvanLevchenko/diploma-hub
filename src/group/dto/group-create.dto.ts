import { IsString, MaxLength, MinLength } from "class-validator";

export abstract class GroupCreateDto {
  @IsString()
  @MaxLength(8)
  @MinLength(6)
  name: string;
}
