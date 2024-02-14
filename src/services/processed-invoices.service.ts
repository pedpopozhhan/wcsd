import { IProcessedInvoiceTableRowData } from '@/interfaces/processed-invoice/processed-invoice-table-row-data';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IProcessedInvoices from '@/interfaces/processed-invoice/processed-invoices';
interface IProcessedInvoicesGetBody {
    contractNumber: string;
}
class ProcessedInvoicesService {
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

    getInvoices(contractNumber: string): Observable<IProcessedInvoices> {
        const body: IProcessedInvoicesGetBody = {
            contractNumber: contractNumber,
        };
        return axios
            .request<IProcessedInvoices>({
                method: 'post',
                url: this.baseUrl + '/GetInvoices',
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
export default new ProcessedInvoicesService();
