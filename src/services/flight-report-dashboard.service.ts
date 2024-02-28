import { Observable, map } from 'rxjs';
import axios from 'axios-observable';
import IFlightReportDashboardResponse from '@/interfaces/flight-report-dashboard/flight-report-dashboard-response.interface';
import { ISearch } from '@/interfaces/flight-report-dashboard/search.interface';
import getHeaders from './headers';

class FlightReportDashboardService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  getSearch(token: string, objISearch: ISearch): Observable<IFlightReportDashboardResponse> {
    const body = {
      contractNumber: objISearch.filterBy?.contractNumber,
      status: objISearch.filterBy?.status,
    };

    return axios
      .request<IFlightReportDashboardResponse>({
        method: 'post',
        url: this.baseUrl + '/GetTimeReportCosts',
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
const flightReportDashboardService = new FlightReportDashboardService();
export default flightReportDashboardService;
