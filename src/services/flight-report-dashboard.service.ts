import { ISearch } from '../interfaces/flight-report-dashboard/search.interface';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IFlightReportDashboardResponse from '@/interfaces/flight-report-dashboard/flight-report-dashboard-response.interface';

class FlightReportDashboardService {
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
  getSearch(objISearch: ISearch): Observable<IFlightReportDashboardResponse> {
    const body = {
      contractNumber: objISearch.filterBy?.contractNumber,
      status: objISearch.filterBy?.status,
    };

    return axios
      .request<IFlightReportDashboardResponse>({
        method: 'post',
        url: this.baseUrl + '/GetTimeReportCosts',
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
const flightReportDashboardService = new FlightReportDashboardService();
export default flightReportDashboardService;
