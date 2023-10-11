import { PagingResponse } from './paging-response';
import { SearchResult } from './search-result';

export class SearchResponse extends PagingResponse {
  searchResults: SearchResult[];
}
