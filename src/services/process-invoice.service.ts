import { IInvoiceRequest, IInvoiceResponse, IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import getHeaders from './headers';

class ProcessInvoiceService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  doesInvoiceNumberExistForContract(token: string, invoiceNumber: string, contractNumber: string): Observable<boolean> {
    const url = `${this.baseUrl}/DoesInvoiceNumberExist?invoiceNumber=${invoiceNumber}&contractNumber=${contractNumber}`;

    return axios
      .request<boolean>({
        method: 'get',
        url: url,
        headers: getHeaders(token),
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }

  createInvoice(token: string, processInvoiceData: IProcessInvoiceData): Observable<string> {
    return axios
      .request<string>({
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

  updateInvoice(token: string, invoiceData: IProcessInvoiceData): Observable<string> {
    return axios
      .request<string>({
        method: 'post',
        url: this.baseUrl + '/UpdateProcessedInvoice',
        headers: getHeaders(token),
        data: invoiceData,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }

  getDrafts(token: string, contractNumber: string) {
    const body: IInvoiceRequest = {
      contractNumber: contractNumber,
    };
    return axios
      .request<IInvoiceResponse>({
        method: 'post',
        url: this.baseUrl + '/GetDrafts',
        headers: getHeaders(token),
        data: body,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }

  saveDraft(token: string, invoice: IProcessInvoiceData) {
    return axios
      .request<string>({
        method: 'post',
        url: this.baseUrl + '/SaveDraft',
        headers: getHeaders(token),
        data: invoice,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }
  deleteDraft(token: string, invoiceId: string) {
    return axios
      .request<string>({
        method: 'post',
        url: this.baseUrl + '/DeleteDraft',
        headers: getHeaders(token),
        data: invoiceId,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }
}

export default new ProcessInvoiceService();
