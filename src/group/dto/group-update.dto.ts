import { IsString, IsUUID } from "class-validator";

export abstract class GroupUpdateDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}
