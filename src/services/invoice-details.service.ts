import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IInvoiceDetails from '@/interfaces/invoice-details/invoice-details';
interface IDetailsServiceGetBody {
  timeReportIds: number[];
}
class InvoiceDetailsService {
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
  getInvoiceDetails(timeReportIds: number[]): Observable<IInvoiceDetails> {
    const body: IDetailsServiceGetBody = {
      timeReportIds: timeReportIds,
    };
    return axios
      .request<IInvoiceDetails>({
        method: 'post',
        url: this.baseUrl + '/GetInvoiceDetails',
        headers: this.headers,
        data: body,
      })
      .pipe(
        map((x) => {
          return x.data;
        })
      );
  }
  getAll(): Observable<IDetailsTableRowData[]> {
    const body: IDetailsServiceGetBody = {
      timeReportIds: [0],
    };
    return axios
      .request<IDetailsTableRowData[]>({
        method: 'post',
        url: this.baseUrl + '/GetInvoiceDetails',
        headers: this.headers,
        data: body,
      })
      .pipe(
        map((x) => {
          console.dir(x.data);
          return x.data;
        })
      );
  }
}
export default new InvoiceDetailsService();
