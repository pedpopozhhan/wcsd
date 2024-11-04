import { ContractType } from '@/common/types/custom-types';

export class SearchRequest {
  searchTerm: string | undefined;
  contractType: ContractType;
}
