import {
  IOneGxContract,
  IOneGxContractDetail,
  IOneGxContractsSearchResponse,
  IOneGxGetContractRequest
} from '@/interfaces/contract-management/onegx-contract-management-data';
import axios from 'axios-observable';
import { Observable, map } from 'rxjs';
import getHeaders from './headers';


class ContractManagementService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  getAll(token: string): Observable<IOneGxContract[]> {
    return axios
      .request<IOneGxContractsSearchResponse>({
        method: 'get',
        url: this.baseUrl + '/GetOneGxContracts',
        headers: getHeaders(token),
      })
      .pipe(
        map((x) => {
          return x.data.data.map((y: IOneGxContract, index: number) => {
            y.index = index;
            return y;
          });
        }),
      );
  }

  getOneGxContract(token: string, contractID: number) {
    const body: IOneGxGetContractRequest = {
      contractID: contractID,
    };
    return axios
      .request<IOneGxContractDetail>({
        method: 'post',
        url: this.baseUrl + '/GetOneGxContract',
        headers: getHeaders(token),
        data: body,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }

}

export default new ContractManagementService();
