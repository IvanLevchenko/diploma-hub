import { IsString, MaxLength } from "class-validator";

export abstract class FileCreateDto {
  @IsString()
  @MaxLength(30)
  filename: string;
}
