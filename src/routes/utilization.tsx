import {
  GoADropdown,
  GoADropdownItem,
  GoAIcon,
  GoAInput,
} from '@abgov/react-components';
import { SetStateAction, forwardRef, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '@/services/search-service';
import styles from './utilization.module.scss';
import { typeItems } from '@/types/contract-type';
import SearchResults from '@/components/search-results';
import { SearchResponse } from '@/models/search-response';
import { SearchResult } from '@/models/search-result';
import SearchSuggestion from '@/components/search-suggestion';

let { search } = styles;

export default function Utilization() {
  const header = 'Contract Utilization';
  let contractType = '0';
  let searchTerm = '';

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const [allData, setAllData] = useState([] as SearchResult[]);

  // Intent is to use this until goa input allows keydown handling
  useEffect(() => {
    const element = document.querySelector('#searchInput') as HTMLInputElement;
    if (element) {
      element.addEventListener('keydown', onKeyDown);
    }
    return () => {
      if (element) {
        element.removeEventListener('keydown', onKeyDown);
      }
    };
  });

  useEffect(() => {
    gatherItems();
  }, [JSON.stringify(allData)]);

  function onSearchTermChange(name: string, term: string) {
    searchTerm = term;
  }

  function onChangeContractType(name: string, type: string | string[]) {
    contractType = type as string;
    performSearch();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      performSearch();
    }
  }

  function gatherItems() {
    searchService
      .getAll()
      .then((fetchedData: SearchResponse) => {
        const data = fetchedData.searchResults.slice();

        // sort descending
        data.sort((a, b) => {
          return a.numTimeReports > b.numTimeReports
            ? -1
            : a.numTimeReports < b.numTimeReports
            ? 1
            : 0;
        });

        setAllData(data);
        setSearchResults(data);
        // // filter on search term, contract type
        // let filtered = fetchedData.searchResults?.filter(
        //   (x) => contractType === '0' || x.type.toString() === contractType
        // );
        // setSearchResults(
        //   filtered.filter(
        //     (x) =>
        //       x.businessId.toString().includes(searchTerm) ||
        //       x.vendor.toUpperCase().includes(searchTerm.toUpperCase())
        //   )
        // );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function performSearch() {
    // searchService
    //   .getAll()
    //   .then((fetchedData: SearchResponse) => {
    //     // filter on search term, contract type
    //     let filtered = fetchedData.searchResults?.filter(
    //       (x) => contractType === '0' || x.type.toString() === contractType
    //     );
    //     setSearchResults(
    //       filtered.filter(
    //         (x) =>
    //           x.businessId.toString().includes(searchTerm) ||
    //           x.vendor.toUpperCase().includes(searchTerm.toUpperCase())
    //       )
    //     );
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }

  function handleOnEnter(results: SearchResult[]) {
    setSearchResults(results);
  }

  // can we turn off the auto selection when typing? type, then select from menu with enter or click, but
  return (
    <main>
      <h2>{header}</h2>
      <div className={search}>
        <SearchSuggestion
          allData={allData}
          onEnter={handleOnEnter}
        ></SearchSuggestion>
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
