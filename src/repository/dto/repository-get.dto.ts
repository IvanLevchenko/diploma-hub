import { IsUUID } from "class-validator";

export abstract class RepositoryGetDto {
  @IsUUID()
  id: string;
}
