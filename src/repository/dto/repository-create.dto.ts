import { ArrayMinSize, IsArray, IsString } from "class-validator";

export abstract class RepositoryCreateDto {
  @IsString()
  subject: string;

  @IsArray({ each: true })
  @ArrayMinSize(1)
  groups: string[];
}
