import { IsUUID } from "class-validator";

export abstract class GroupGetDto {
  @IsUUID()
  id: string;
}
