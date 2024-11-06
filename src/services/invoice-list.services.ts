import { IInvoiceListSearchResultResponse } from '@/interfaces/invoicing/invoice-list-data';

import axios from 'axios-observable';
import { Observable, map } from 'rxjs';
import getHeaders from './headers';
class InvoiceListService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  getInvoiceList(token: string): Observable<IInvoiceListSearchResultResponse> {
    return axios
      .request<IInvoiceListSearchResultResponse>({
        method: 'post',
        url: this.baseUrl + '/GetInvoiceList',
        headers: getHeaders(token)
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }
}

export default new InvoiceListService();
