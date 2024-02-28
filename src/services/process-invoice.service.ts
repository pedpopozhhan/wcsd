import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import { IServiceSheetData } from '@/interfaces/common/service-sheet-data';
import getHeaders from './headers';
class ProcessInvoiceService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  createInvoice(token: string, processInvoiceData: IProcessInvoiceData): Observable<number> {
    return axios
      .request<number>({
        method: 'put',
        url: this.baseUrl + '/CreateInvoice',
        headers: getHeaders(token),
        data: processInvoiceData,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }

  updateInvoice(token: string, serviceSheetData: IServiceSheetData): Observable<string> {
    return axios
      .request<string>({
        method: 'post',
        url: this.baseUrl + '/UpdateProcessedInvoice',
        headers: getHeaders(token),
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
