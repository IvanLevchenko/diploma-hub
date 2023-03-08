import { IsUUID } from "class-validator";

export abstract class UserGetDto {
  @IsUUID()
  id: string;
}
