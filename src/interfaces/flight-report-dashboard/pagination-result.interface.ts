import { IPagination } from './pagination.interface';

export interface IPaginationResult<T> {
  status?: string | undefined;
  errorCodeId: string;
  errorMessage: string;
  paginationInfo: IPagination;
  data: T[];
}
