import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import ITimeReportDetails from '@/interfaces/invoice-details/time-report-details';
import getHeaders from './headers';
interface IDetailsServiceGetBody {
  timeReportIds: number[];
}
class TimeReportDetailsService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  getTimeReportDetails(token: string, timeReportIds: number[]): Observable<ITimeReportDetails> {
    const body: IDetailsServiceGetBody = {
      timeReportIds: timeReportIds,
    };
    return axios
      .request<ITimeReportDetails>({
        method: 'post',
        url: this.baseUrl + '/GetTimeReportDetails',
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
export default new TimeReportDetailsService();
