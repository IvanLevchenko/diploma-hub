import { IsUUID } from "class-validator";

export abstract class FileDeleteDto {
  @IsUUID()
  id: string;
}
