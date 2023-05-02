import { IsOptional, IsUUID } from "class-validator";

export abstract class FileListDto {
  @IsUUID()
  @IsOptional()
  repositoryId?: string;

  @IsOptional()
  pageInfo?: {
    page: number;
    pageSize: number;
  };
}
