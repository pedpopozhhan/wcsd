
import { IPagination } from "./IPagination";

export interface IPaginationResult<T>
  {
    status?:string | undefined,
    errorCodeId:string,
    errorMessage:string,
    paginationInfo:IPagination,
    data: T[]
  };