import { ArrayMinSize, IsArray, IsString } from "class-validator";

export abstract class RepositoryCreateDto {
  @IsString()
  name: string;

  @IsString()
  subject: string;

  @IsArray()
  @ArrayMinSize(1)
  groups: string[];
}
