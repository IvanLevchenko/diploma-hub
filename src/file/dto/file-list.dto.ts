import { IsUUID } from "class-validator";

export abstract class FileListDto {
  @IsUUID()
  repositoryId?: string;
  pageInfo?: {
    page: number;
    pageSize: number;
  };
}
