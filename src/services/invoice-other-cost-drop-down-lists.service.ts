import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IOtherCostDropDownLists from '@/interfaces/invoice-details/other-cost-drop-down-lists';


class InvoiceOtherCostDDLService {
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
  getOtherCostDropDownLists(): Observable<IOtherCostDropDownLists> {

    return axios
      .request<IOtherCostDropDownLists>({
        method: 'get',
        url: this.baseUrl + '/GetCustomLists',
        headers: this.headers,
      })
      .pipe(
        map((x) => {
          return x.data;
        })
      );
  }
  getAll(): Observable<IOtherCostDropDownLists> {
    return axios
      .request<IOtherCostDropDownLists>({
        method: 'get',
        url: this.baseUrl + '/GetCustomLists',
        headers: this.headers,
      })
      .pipe(
        map((x) => {
          console.dir(x.data);
          return x.data;
        })
      );
  }
}
export default new InvoiceOtherCostDDLService();
