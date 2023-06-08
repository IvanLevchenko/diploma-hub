import { IsUUID } from "class-validator";

export abstract class GroupDeleteDto {
  @IsUUID()
  id: string;
}
