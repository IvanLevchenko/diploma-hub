import { IsString, IsUUID } from "class-validator";
import { File } from "../file.entity";

export abstract class FileCreateDto {
  @IsString()
  filename: string;

  @IsUUID()
  repositoryId: string;
}

export abstract class FileCreateDtoOut extends File {
  passed: boolean;
  percent: number;
}
