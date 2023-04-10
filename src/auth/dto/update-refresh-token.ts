import { IsUUID } from "class-validator";

export abstract class UpdateRefreshToken {
  @IsUUID()
  id: string;
}
