import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';

import { Observable, map, of } from 'rxjs';
import axios from 'axios-observable';
interface IDetailsServiceGetBody {
  timeReportIds: number[];
}
class InvoiceDetailsService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  getInvoiceDetails(
    timeReportIds: number[]
  ): Observable<IDetailsTableRowData[]> {
    const body: IDetailsServiceGetBody = {
      timeReportIds: timeReportIds,
    };
    return axios
      .request<IDetailsTableRowData[]>({
        method: 'post',
        url: this.baseUrl + '/GetInvoiceDetails',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: body,
      })
      .pipe(
        map((x) => {
          console.dir(x.data);
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
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
        date: new Date(date + 86400000 * i),
        registrationNumber: `${i}`,
        reportNumber: i,
        aO02Number: `${i}`,
        rateType: `${i}`,
        numberOfUnits: i,
        rateUnit: `${i}`,
        ratePerUnit: i, //with $0.00
        cost: i * 1000.25, //with $0.00
        glAccountNumber: i,
        profitCentre: `${i}`,
        costCentre: `${i}`,
        fireNumber: `${i}`,
        internalOrder: `${i}`,
        fund: i,
      });
    }

    return results;
  }
}
export default new InvoiceDetailsService();
