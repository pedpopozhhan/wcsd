import { SearchResponse } from '@/models/search-response';
import { GoATable, GoATableSortHeader } from '@abgov/react-components';
import React from 'react';

interface ISearchResultsProps {
  searchResponse: SearchResponse;
}
const SearchResults: React.FC<ISearchResultsProps> = (props) => {
  //   const columns:{name:string, direction:string[]
  const results = props.searchResponse?.searchResults;
  //   if(!results || )
  return (
    <GoATable>
      <thead>
        <tr>
          <th>
            <GoATableSortHeader name='Vendor'>Vendor</GoATableSortHeader>
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
