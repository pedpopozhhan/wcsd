import { SearchResponse } from '@/models/search-response';
import { SearchResult } from '@/models/search-result';
import { GoATable, GoATableSortHeader } from '@abgov/react-components';
import React, { useEffect, useState } from 'react';

interface ISearchResultsProps {
  searchResponse: SearchResponse;
}
const SearchResults: React.FC<ISearchResultsProps> = (props) => {
  const [results, setResults] = useState(props.searchResponse?.searchResults);
  useEffect(() => {
    setResults(props.searchResponse?.searchResults);
  }, [props.searchResponse?.searchResults]);

  function sortData(sortBy: string, sortDir: number) {
    results.sort((a: any, b: any) => {
      const varA = a[sortBy];
      const varB = b[sortBy];
      if (typeof varA === 'string' || typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setResults(results.slice());
  }

  return (
    <GoATable onSort={sortData}>
      <thead>
        <tr>
          <th>
            <GoATableSortHeader name='vendor'>Vendor</GoATableSortHeader>
          </th>
        </tr>
      </thead>
      <tbody>
        {results?.map((result, idx) => (
          <tr key={idx}>
            <td>{result.vendor}</td>
          </tr>
        ))}
      </tbody>
    </GoATable>
  );
};
export default SearchResults;
