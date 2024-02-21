import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import { IServiceSheetData } from '@/interfaces/common/service-sheet-data';
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

  createInvoice(processInvoiceData: IProcessInvoiceData): Observable<number> {
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
        }),
      );
  }

  updateInvoice(serviceSheetData: IServiceSheetData): Observable<string> {
    return axios
      .request<string>({
        method: 'post',
        url: this.baseUrl + '/UpdateProcessedInvoice',
        headers: this.headers,
        data: serviceSheetData,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }
}

export default new ProcessInvoiceService();
