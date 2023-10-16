import { SearchResponse } from '@/models/search-response';
import { SearchResult, searchResultColumns } from '@/models/search-result';
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
          {searchResultColumns.map((column, idx) => (
            <th key={idx}>
              <GoATableSortHeader name={column.value}>
                {column.label}
              </GoATableSortHeader>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results?.map((result, idx) => (
          <tr key={idx}>
            {searchResultColumns.map((column, idx) => (
              <td key={idx}>{result[column.value as keyof SearchResult]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </GoATable>
  );
};
export default SearchResults;
