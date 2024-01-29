import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';

import { Observable, map, of } from 'rxjs';
import axios from 'axios-observable';
interface IProcessInvoiceResult {
  invoiceId : number;
};
class ProcessInvoiceService {
  private baseUrl: string;
  private apiKeyCode: string;
  private headers: { [key: string]: string };
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.apiKeyCode = import.meta.env.VITE_API_KEY_CODE;
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'x-functions-key': this.apiKeyCode,
    };
  }

  createInvoice(processInvoiceData: IProcessInvoiceData) : Observable<number>{
  return axios
  .request<number>({
    method: 'put',
    url: this.baseUrl + '/CreateInvoice',
    headers: this.headers,
    data: processInvoiceData,
  })
  .pipe(
    map((x) => {
      return x.data;
    })
  );
  }
}


export default new ProcessInvoiceService();
