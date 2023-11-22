import { GoADropdown, GoADropdownItem } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import searchService from '@/routes/vendor-time-reports/flight-report-dashboard/services/search-service';
import styles from './utilization.module.scss';
import { typeItems } from '@/types/contract-type';
import SearchResults from '@/routes/utilization/search-results';
import { SearchResponse } from '@/routes/utilization/search-response';
import { SearchResult } from '@/routes/utilization/search-result';
import SearchSuggestion from '@/routes/utilization/search-suggestion';
import { SearchOption } from '@/routes/utilization/search-option';

let { top, search } = styles;

export default function Utilization() {
  const header = 'Invoice Reconciliation';

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const [allData, setAllData] = useState([] as SearchResult[]);
  const [searchTerm, setSearchTerm] = useState('' as string | SearchOption);
  const [contractType, setContractType] = useState('0');

  useEffect(() => {
    gatherItems();
  }, [JSON.stringify(allData)]);

  function gatherItems() {
    searchService
      .getAll()
      .then((fetchedData: SearchResponse) => {
        const data = fetchedData.searchResults.slice();

        // sort ascending

        data.sort((a, b) => {
          return b.vendor > a.vendor ? -1 : b.vendor < a.vendor ? 1 : 0;
        });

        setAllData(data);
        setSearchResults(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleOnEnter(filtered: SearchOption[]) {
    const results = filtered.map((x) => {
      const splits = x.label.split(separator);
      const foundIdx = allData.findIndex(
        (x) => x.vendor === splits[0] && x.businessId.toString() === splits[1]
      );
      return allData[foundIdx];
    });

    setSearchResults(
      results.filter(
        (x) => contractType === '0' || x.type.toString() === contractType
      )
    );
  }

  function onChangeContractType(name: string, type: string | string[]) {
    const _contractType = type as string;
    setContractType(_contractType as string);
    // rerun the search, sometimes it is the term, sometimes it is an item with a separator
    let filtered = allData.filter(
      (x) => _contractType === '0' || x.type.toString() === _contractType
    );

    if (typeof searchTerm == 'string') {
      const term = searchTerm as string;
      setSearchResults(
        filtered.filter((x) => {
          return (
            x.businessId.toString().includes(term) ||
            x.vendor.toUpperCase().includes(term.toUpperCase())
          );
        })
      );
    } else {
      const splits = searchTerm.label.split(separator);
      const result = filtered.find((x) => x.vendor === splits[0]);
      if (result) {
        setSearchResults([result]);
      } else {
        setSearchResults([]);
      }
    }
  }

  function handleOnChange(newValue: string | SearchOption) {
    setSearchTerm(newValue);
    if (!newValue) {
      setSearchResults(allData);
    }
  }

  const separator = ' - ';
  function createOptions(): SearchOption[] {
    return allData.map((item) => {
      const val = `${item.vendor}${separator}${item.businessId}`;
      return { value: val, label: val };
    });
  }

  function filterPredicate(candidate: SearchOption, inputValue: string) {
    const upCase = inputValue.toUpperCase();
    const splits = candidate.label.split(separator);
    const found = splits.some((x) => x.toUpperCase().startsWith(upCase));
    return found;
  }

  return (
    <main>
      <div className={top}>
        <h2>{header}</h2>
        <div className={search}>
          <SearchSuggestion
            options={createOptions()}
            filterPredicate={filterPredicate}
            onEnter={handleOnEnter}
            onChange={handleOnChange}
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
      </div>

      <SearchResults searchResults={searchResults}></SearchResults>
    </main>
  );
}
