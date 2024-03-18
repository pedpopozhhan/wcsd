import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import { IContractSearchResultResponse } from '@/interfaces/contracts/contract-search-result.interface';
import axios from 'axios-observable';
import { Observable, map } from 'rxjs';
import getHeaders from './headers';
class ContractSearchService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  getAll(token: string): Observable<IContractSearchResult[]> {
    return axios
      .request<IContractSearchResultResponse>({
        method: 'get',
        url: this.baseUrl + '/GetContracts',
        headers: getHeaders(token),
      })
      .pipe(
        map((x) => {
          return x.data.rows.map((y: IContractSearchResult, index: number) => {
            y.index = index;
            return y;
          });
        }),
      );
  }
}

export default new ContractSearchService();
