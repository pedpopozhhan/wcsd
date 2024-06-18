import { IOneGxContractRowData } from '@/interfaces/contract-management/onegx-contract-search-row-data';

export interface IOneGxContractSearchResponse {
  count: number;
  data: IOneGxContractRowData[];
}
