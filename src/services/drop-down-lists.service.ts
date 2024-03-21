import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IOtherCostDropDownLists from '@/interfaces/invoice-details/other-cost-drop-down-lists';
import getHeaders from './headers';

class DropDownListService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  getOtherCostDropDownLists(token: string): Observable<IOtherCostDropDownLists> {
    return axios
      .request<IOtherCostDropDownLists>({
        method: 'get',
        url: this.baseUrl + '/GetCustomLists',
        headers: getHeaders(token),
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }
  getAll(token: string): Observable<IOtherCostDropDownLists> {
    return axios
      .request<IOtherCostDropDownLists>({
        method: 'get',
        url: this.baseUrl + '/GetCustomLists',
        headers: getHeaders(token),
      })
      .pipe(
        map((x) => {
          console.dir(x.data);
          return x.data;
        }),
      );
  }
}
export default new DropDownListService();
