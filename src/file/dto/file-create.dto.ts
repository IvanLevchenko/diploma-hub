import { IsString, IsUUID, MaxLength } from "class-validator";

export abstract class FileCreateDto {
  @IsString()
  @MaxLength(30)
  filename: string;

  @IsUUID()
  repository: string;
}
