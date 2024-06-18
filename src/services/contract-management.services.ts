import { IOneGxContractRowData } from '@/interfaces/contract-management/onegx-contract-search-row-data';
import { IOneGxContractSearchResponse } from '@/interfaces/contract-management/onegx-contract-search-response';
import axios from 'axios-observable';
import { Observable, map } from 'rxjs';
import getHeaders from './headers';
class ContractManagementService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  getAll(token: string): Observable<IOneGxContractRowData[]> {
    return axios
      .request<IOneGxContractSearchResponse>({
        method: 'get',
        url: this.baseUrl + '/GetOneGxContracts',
        headers: getHeaders(token),
      })
      .pipe(
        map((x) => {
          return x.data.data.map((y: IOneGxContractRowData, index: number) => {
            y.index = index;
            return y;
          });
        }),
      );
  }
}

export default new ContractManagementService();
