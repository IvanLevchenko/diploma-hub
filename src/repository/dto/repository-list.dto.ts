export abstract class RepositoryListDto {
  pageInfo?: {
    page: number;
    pageSize: number;
  };
  subjects?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  name?: string;
}
