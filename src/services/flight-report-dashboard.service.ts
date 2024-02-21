import { IFlightReportDashboard } from '../interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IPaginationResult } from '../interfaces/pagination-result.interface';
import { ISearch } from '../interfaces/flight-report-dashboard/search.interface';

import { Observable, map } from 'rxjs';
import axios from 'axios-observable';

class FlightReportDashboardService {
  private baseUrl: string;
  private apiKeyCode: string;
  private headers: { [key: string]: string };
  constructor() {
    this.baseUrl = import.meta.env.VITE_AVIATION_API_BASE_URL;
    this.apiKeyCode = import.meta.env.VITE_API_KEY_CODE;
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'x-functions-key': this.apiKeyCode,
    };
  }
  getSearch(objISearch: ISearch): Observable<IPaginationResult<IFlightReportDashboard>> {
    const body = {
      search: objISearch.search,
      sortBy: objISearch.sortBy,
      sortOrder: objISearch.sortOrder,
      filterBy: {
        contractNumber: objISearch.filterBy?.contractNumber,
        status: objISearch.filterBy?.status,
      },
      paginationInfo: {
        perPage: objISearch.pagination.perPage,
        page: objISearch.pagination.page,
      },
    };

    return axios
      .request<IPaginationResult<IFlightReportDashboard>>({
        method: 'post',
        url: this.baseUrl + '/flight-report-dashboard/cost',
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
