import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IInvoiceDetails from '@/interfaces/invoice-details/time-report-details';
interface IDetailsServiceGetBody {
  timeReportIds: number[];
}
class TimeReportDetailsService {
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
  getTimeReportDetails(timeReportIds: number[]): Observable<IInvoiceDetails> {
    const body: IDetailsServiceGetBody = {
      timeReportIds: timeReportIds,
    };
    return axios
      .request<IInvoiceDetails>({
        method: 'post',
        url: this.baseUrl + '/GetTimeReportDetails',
        headers: this.headers,
        data: body,
      })
      .pipe(
        map((x) => {
          return x.data;
        })
      );
  }
}
export default new TimeReportDetailsService();
