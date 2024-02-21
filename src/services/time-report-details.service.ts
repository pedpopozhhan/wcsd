import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import ITimeReportDetails from '@/interfaces/invoice-details/time-report-details';
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
  getTimeReportDetails(timeReportIds: number[]): Observable<ITimeReportDetails> {
    const body: IDetailsServiceGetBody = {
      timeReportIds: timeReportIds,
    };
    return axios
      .request<ITimeReportDetails>({
        method: 'post',
        url: this.baseUrl + '/GetTimeReportDetails',
        headers: this.headers,
        data: body,
      })
      .pipe(
        map((x) => {
          return x.data;
        }),
      );
  }
}
export default new TimeReportDetailsService();
