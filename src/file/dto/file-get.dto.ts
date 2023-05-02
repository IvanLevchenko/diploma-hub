import { IsUUID } from "class-validator";

export abstract class FileGetDto {
  @IsUUID()
  id: string;
}
