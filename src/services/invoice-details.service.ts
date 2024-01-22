import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';

import { Observable, map, of } from 'rxjs';
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

export class SampleData {
  static GetSampleResults(): IDetailsTableRowData[] {
    const results: IDetailsTableRowData[] = [];
    const date = Date.now();
    for (let i = 1; i <= 50; i++) {
      results.push({
        flightReportDate: new Date(date + 86400000 * i),
        contractRegistrationName: `${i}`,
        flightReportId: i,
        aO02Number: `${i}`,
        rateType: `${i}`,
        numberOfUnits: i,
        rateUnit: `${i}`,
        ratePerUnit: i, //with $0.00
        cost: i * 1000.25, //with $0.00
        account: i,
        profitCenter: `${i}`,
        costCenter: `${i}`,
        fireNumber: `${i}`,
        internalOrder: `${i}`,
        fund: i,
      });
    }

    return results;
  }
}
export default new InvoiceDetailsService();
