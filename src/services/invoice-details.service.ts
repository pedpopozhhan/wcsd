import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';

import { Observable, map, of } from 'rxjs';

class InvoiceDetailsService {
  private baseUrl: string;
  private functionsKey: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.functionsKey = import.meta.env.VITE_API_KEY_CODE;
  }

  getAll(): Observable<IDetailsTableRowData[]> {
    return of(SampleData.GetSampleResults());
  }
}

export class SampleData {
  static GetSampleResults(): IDetailsTableRowData[] {
    const results: IDetailsTableRowData[] = [];
    const date = Date.now();
    for (let i = 1; i <= 50; i++) {
      results.push({
        date: new Date(date + 1000 * i),
        registrationNumber: `${i}`,
        reportNumber: i,
        aO02Number: `${i}`,
        rateType: `${i}`,
        numberOfUnits: i,
        rateUnit: `${i}`,
        ratePerUnit: i, //with $0.00
        cost: i, //with $0.00
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
