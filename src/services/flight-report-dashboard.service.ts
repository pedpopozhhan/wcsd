// import {
//   httpAviationReporting,
//   httpAviationReportingAuthentication,
// } from './http-common';
import { IFlightReportDashboard } from '../interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IPaginationResult } from '../interfaces/pagination-result.interface';
import { ISearch } from '../interfaces/flight-report-dashboard/search.interface';

// const getAuthenticate = async () => {
//   const data = await httpAviationReportingAuthentication.post<string>(
//     '/authentication/authenticate',
//     {
//       username: 'andrew.mitchell',
//       password: 'password',
//     }
//   );

//   return data;
// };

//Search
// const getSearch = async (objISearch: ISearch) => {
//   const params = JSON.stringify({
//     search: objISearch.search,
//     sortBy: objISearch.sortBy,
//     sortOrder: objISearch.sortOrder,
//     filterBy: {
//       contractNumber: objISearch.filterBy?.contractNumber,
//       status: objISearch.filterBy?.status,
//     },
//     paginationInfo: {
//       perPage: objISearch.pagination.perPage,
//       page: objISearch.pagination.page,
//     },
//   });

//   const data = await httpAviationReporting.post<
//     IPaginationResult<IFlightReportDashboard>
//   >('/flight-report-dashboard/cost', params, {
//     headers: {
//       Authorization: `Bearer ${sessionStorage.getItem('api_token')}`,
//     },
//   });

//   return data;
// };

// export const FlightReportDashboardService = {
//   getAuthenticate,
//   getSearch,
// };
import { Observable, map, of } from 'rxjs';
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
  getSearch(
    objISearch: ISearch
  ): Observable<IPaginationResult<IFlightReportDashboard>> {
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
        })
      );
  }
}
const flightReportDashboardService = new FlightReportDashboardService();
export default flightReportDashboardService;
