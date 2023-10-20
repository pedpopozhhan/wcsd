import {
  GoADropdown,
  GoADropdownItem,
  GoAInput,
} from '@abgov/react-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '@/services/search-service';
import styles from './utilization.module.scss';
import { typeItems } from '@/types/contract-type';
import SearchResults from '@/components/search-results';
import { SearchResponse } from '@/models/search-response';
import { SearchResult } from '@/models/search-result';

let { search } = styles;

export default function Utilization() {
  const header = 'Contract Utilization';
  let contractType = '0';
  let searchTerm = '';

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);

  // Intent is to use this until goa input allows keydown handling
  useEffect(() => {
    const element = document.querySelector('#searchInput');
    if (element) {
      console.log('element exists');
      element.addEventListener('keydown', onKeyDown);
    }
    return () => {
      if (element) {
        element.removeEventListener('keydown', onKeyDown);
      }
    };
  });

  function onSearchTermChange(name: string, term: string) {
    searchTerm = term;
  }

  function onChangeContractType(name: string, type: string | string[]) {
    contractType = type as string;
    performSearch();
  }

  function onKeyDown(event: any) {
    if (event.keyCode === 13) {
      performSearch();
    }
  }

  function performSearch() {
    searchService
      .getAll()
      .then((fetchedData: SearchResponse) => {
        // filter on search term, contract type
        let filtered = fetchedData.searchResults?.filter(
          (x) => contractType === '0' || x.type.toString() === contractType
        );
        setSearchResults(
          filtered.filter(
            (x) =>
              x.businessId.toString().includes(searchTerm) ||
              x.vendor.toUpperCase().includes(searchTerm.toUpperCase())
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <main>
      <h2>{header}</h2>
      <div className={search}>
        <GoAInput
          id='searchInput'
          leadingIcon='search'
          onChange={onSearchTermChange}
          value={searchTerm}
          name='searchInput'
          type='search'
        />
      </div>

      <GoADropdown
        name='contractType'
        value={contractType}
        onChange={onChangeContractType}
      >
        {typeItems.map((type, idx) => (
          <GoADropdownItem
            key={idx}
            value={type.value.toString()}
            label={type.label}
          />
        ))}
      </GoADropdown>

      <SearchResults searchResults={searchResults}></SearchResults>
    </main>
  );
}

/*Search Field pre-emptively suggests for input follows ‘aviations' search component

Search Field pre-emptively suggests for input translation of Business IDs to Vendor Name
concatenated

type in Cat, suggests Catlike Flying - 1234568, clicking that suggestion inputs Catlike Flying

type in 123, suggests 1234568 - Catlike Flying, clicking that suggestion inputs 
1234568

Upon deletion of Search Field (clicking ‘X' inside of field), returns to default (alpha numeric || numeric alpha)

Alternatively deleting input characters with backspace will only clear field, not reset query. If they click enter on an empty search field will query default list*/
