import { ContractType } from '@/common/types/contract-type';

export class SearchRequest {
  searchTerm: string | undefined;
  contractType: ContractType;
}
