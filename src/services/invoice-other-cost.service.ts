import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { Observable, of } from 'rxjs';

class InvoiceOtherCostService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  getAll(): Observable<IOtherCostTableRowData[]> {
    return of(SampleData.GetSampleResults());
  }
}

export class SampleData {
  static GetSampleResults(): IOtherCostTableRowData[] {
    const results: IOtherCostTableRowData[] = [];
    const date = Date.now();
    for (let i = 1; i <= 5; i++) {
      results.push({
        index: i,
        from: new Date(date + 86400000 * i),
        to: new Date(date + 86400000 * i),
        rateType: `${i}`,
        unit: `${i}`,
        ratePerUnit: 1234.25,
        numberOfUnits: i,
        cost: i * 1234.25, //with $0.00
        glAcct: `${i}`,
        profitCentre: `${i}`,
        costCentre: `${i}`,
        remarks: `${i}`,
        internalOrder: `${i}`,
        fund: `${i}`,
        invoiceId: `${i}`,
      });
    }

    return results;
  }
}
export default new InvoiceOtherCostService();
