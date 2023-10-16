import { ContractType } from '../types/contract-type';
import { PagingRequest } from './paging-request';

export class SearchRequest {
  searchTerm: string | undefined;
  contractType: ContractType;
}
