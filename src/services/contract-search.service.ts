import { IContractSearchResult } from '@/interfaces/contracts/contract-search-result';
import { IContractSearchResultResponse } from '@/interfaces/contracts/contract-search-result.interface';
import axios from 'axios-observable';
import { Observable, map } from 'rxjs';

class ContractSearchService {
  private baseUrl: string;
  private apiKeyCode: string;
  private headers: { [key: string]: string };
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.apiKeyCode = import.meta.env.VITE_API_KEY_CODE;
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'x-functions-key': this.apiKeyCode,
    };
  }
  getAll(): Observable<IContractSearchResult[]> {
    return axios
      .request<IContractSearchResultResponse>({
        method: 'get',
        url: this.baseUrl + '/GetContracts',
        headers: this.headers,
      })
      .pipe(
        map((x) => {
          return x.data.rows;
        }),
      );
  }
}

export default new ContractSearchService();
