import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IProcessedInvoiceDetailResponse from '@/interfaces/processed-invoice/processed-invoice-detail-response';
import getHeaders from './headers';
interface IProcessedInvoicesGetBody {
  invoiceKey: number;
}
class ProcessedInvoiceDetailService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  getInvoiceDetail(token: string, invoiceKey: number): Observable<IProcessedInvoiceDetailResponse> {
    const body: IProcessedInvoicesGetBody = {
      invoiceKey: invoiceKey,
    };
    return axios
      .request<IProcessedInvoiceDetailResponse>({
        method: 'post',
        url: this.baseUrl + '/GetInvoiceDetails',
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
export default new ProcessedInvoiceDetailService();
