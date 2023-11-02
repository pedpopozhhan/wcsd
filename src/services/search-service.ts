import { SearchRequest } from '@/models/search-request';

class SearchService {
  private baseUrl: string;
  private functionsKey: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.functionsKey = import.meta.env.VITE_API_KEY_CODE;
  }

  getAll() {
    return fetch(this.baseUrl + '/FlightReportAll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-functions-key': this.functionsKey,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
  }
  search(query: SearchRequest) {
    return fetch(this.baseUrl + '/FlightReportSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
  }
}

export default new SearchService();
