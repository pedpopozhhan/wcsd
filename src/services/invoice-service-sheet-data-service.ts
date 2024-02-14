
import { IServiceSheetData } from '@/interfaces/common/service-sheet-data';
import { Observable, map, of } from 'rxjs';

class InvoiceServiceSheetDataService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    }

    getAll(): Observable<IServiceSheetData> {
        return of(SampleData.GetSampleResults());
    }
}


export class SampleData {
    static GetSampleResults(): IServiceSheetData {
        const results: IServiceSheetData = {
            uniqueServiceSheetName: '',
            purchaseGroup: 'W01 (FP_W01)',
            serviceDescription: 'Professional Services',
            communityCode: '[Determined from Contract]',
            materialGroup: '[Determined from Contract]',
            accountType: 'Expense',
            quantity: 1,
            unitOfMeasure: 'Hour',
            price: 0
        };
        return results;
    }
}
export default new InvoiceServiceSheetDataService();
