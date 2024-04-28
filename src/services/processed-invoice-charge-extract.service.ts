import { ICreateChargeExtractRequest } from '@/interfaces/processed-invoice/create-charge-extract-request';
import { IGetChargeExtractRequest } from '@/interfaces/processed-invoice/get-charge-extract-request';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import getHeaders from './headers';
class ProcessedInvoiceChargeExtractService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }


  createChargeExtract(token: string, createChargeExtractRequest: ICreateChargeExtractRequest): Observable<string> {
    return axios
      .request<string>({
        method: 'put',
        url: this.baseUrl + '/CreateChargeExtract',
        headers: getHeaders(token),
        data: createChargeExtractRequest,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }

  getChargeExtract(token: string, getChargeExtractReq: IGetChargeExtractRequest): Observable<string> {
    return axios
      .request<string>({
        method: 'post',
        url: this.baseUrl + '/GetChargeExtract',
        headers: getHeaders(token),
        data: getChargeExtractReq,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }
}

export default new ProcessedInvoiceChargeExtractService();
