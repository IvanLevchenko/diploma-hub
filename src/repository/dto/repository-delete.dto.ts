import { IsUUID } from "class-validator";

export abstract class RepositoryDeleteDto {
  @IsUUID()
  id: string;
}
