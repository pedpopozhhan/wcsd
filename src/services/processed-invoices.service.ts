import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IProcessedInvoices from '@/interfaces/processed-invoice/processed-invoices';
import getHeaders from './headers';
interface IProcessedInvoicesGetBody {
  contractNumber: string;
}
class ProcessedInvoicesService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  getInvoices(token: string, contractNumber: string): Observable<IProcessedInvoices> {
    const body: IProcessedInvoicesGetBody = {
      contractNumber: contractNumber,
    };
    return axios
      .request<IProcessedInvoices>({
        method: 'post',
        url: this.baseUrl + '/GetInvoices',
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
export default new ProcessedInvoicesService();
