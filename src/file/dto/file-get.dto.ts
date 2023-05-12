import { IsOptional, IsString, IsUUID } from "class-validator";

export abstract class FileGetDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  isPreview?: string;
}
