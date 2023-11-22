import { IFilter } from "./IFilter";
import { IPagination } from "./IPagination";

export interface ISearch {
    search?: string | undefined,
    sortBy?:string,
    sortOrder?:string,
    filterBy?:IFilter,
    pagination:IPagination, 
  };