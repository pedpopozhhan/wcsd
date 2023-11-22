import { IFilter } from './filter.interface';
import { IPagination } from './pagination.interface';

export interface ISearch {
  search?: string | undefined;
  sortBy?: string;
  sortOrder?: string;
  filterBy?: IFilter;
  pagination: IPagination;
}
