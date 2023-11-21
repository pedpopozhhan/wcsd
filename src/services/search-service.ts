import { SearchRequest } from '@/routes/utilization/search-request';
import { SearchResponse } from '@/routes/utilization/search-response';
import { SearchResult } from '@/routes/utilization/search-result';

class SearchService {
  private baseUrl: string;
  private functionsKey: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.functionsKey = import.meta.env.VITE_API_KEY_CODE;
  }

  getAll(): Promise<SearchResponse> {
    return new Promise((resolve, reject) => {
      return resolve({ searchResults: SampleData.GetSampleResults() });
    });

    // return fetch(this.baseUrl + '/FlightReportAll', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-functions-key': this.functionsKey,
    //   },
    // }).then((response) => {
    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }
    //   return response.json();
    // });
  }
  //   search(query: SearchRequest) {
  //     return fetch(this.baseUrl + '/FlightReportSearch', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(query),
  //     }).then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     });
  //   }
}

export class SampleData {
  static GetSampleResults(): SearchResult[] {
    const results: SearchResult[] = [];

    for (let i = 1; i <= 50; i++) {
      results.push({
        vendor: `Vendor${i}`,
        businessId: 200 + i,
        contractId: 100 + i,
        type: i % 2 == 0 ? 1 : 2,
        numTimeReports: i,
      });
    }

    return results;
  }
}
export default new SearchService();
