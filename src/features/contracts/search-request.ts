import { ContractType } from '@/types/contract-type';

export class SearchRequest {
  searchTerm: string | undefined;
  contractType: ContractType;
}
