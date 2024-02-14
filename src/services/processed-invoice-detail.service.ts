
import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IProcessedInvoiceDetailResponse from '@/interfaces/processed-invoice/processed-invoice-detail-response';
interface IProcessedInvoicesGetBody {
    invoiceKey: number;
}
class ProcessedInvoiceDetailService {
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

    getInvoiceDetail(invoiceKey: number): Observable<IProcessedInvoiceDetailResponse> {
        const body: IProcessedInvoicesGetBody = {
            invoiceKey: invoiceKey,
        };
        return axios
            .request<IProcessedInvoiceDetailResponse>({
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
}
export default new ProcessedInvoiceDetailService();
