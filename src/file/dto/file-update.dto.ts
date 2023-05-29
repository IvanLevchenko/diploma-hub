import { IsString, IsUUID } from "class-validator";

export abstract class FileUpdateDto {
  @IsUUID()
  id: string;

  @IsString()
  filename: string;
}
