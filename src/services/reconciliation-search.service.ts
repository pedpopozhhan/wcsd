import { IPaginationResult } from '@/interfaces/pagination-result.interface';
import { IPagination } from '@/interfaces/pagination.interface';
import { SearchRequest } from '@/routes/utilization/search-request';
import { SearchResponse } from '@/routes/utilization/search-response';
import { SearchResult } from '@/routes/utilization/search-result';
import axios from 'axios-observable';
import { Observable, concatMap, map, of } from 'rxjs';

interface IFlightReportDashboardGetBody {
  filterBy?: {
    status: string;
    reportDateFrom: string;
    reportDateTo: string;
  };
  paginationInfo: IPagination;
}

class ReconciliationService {
  private baseUrl: string;
  private functionsKey: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.functionsKey = import.meta.env.VITE_API_KEY_CODE;
  }

  getAll(): Observable<SearchResult[]> {
    // return of(SampleData.GetSampleResults());

    // The following is for when the aviation api is ready without authentication
    const body: IFlightReportDashboardGetBody = {
      filterBy: {
        status: '',
        reportDateFrom: '',
        reportDateTo: '',
      },
      paginationInfo: {
        perPage: 400, // arbitrary, but should be only around 100-200 results
        page: 1,
      },
    };
    return axios
      .request<IPaginationResult<SearchResult>>({
        method: 'post',
        url: this.baseUrl + '/flight-report-dashboard/vendors/get',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: body,
      })
      .pipe(
        map((x) => {
          return x.data.data;
        })
      );
    // return axios
    //   .post<IPaginationResult<SearchResult>>(
    //     this.baseUrl + '/flight-report-dashboard/vendors/get',
    //     JSON.stringify(body)
    //   )
    //   .pipe(
    //     map((x) => {
    //       return x.data.data;
    //     })
    //   );
  }
}

// export class SampleData {
//   static GetSampleResults(): SearchResult[] {
//     const results: SearchResult[] = [];

//     for (let i = 1; i <= 50; i++) {
//       results.push({
//         vendor: `Vendor${i}`,
//         businessId: 200 + i,
//         contractId: 100 + i,
//         type: i % 2 == 0 ? 1 : 2,
//         numTimeReports: i,
//       });
//     }

//     return results;
//   }
// }
export default new ReconciliationService();
